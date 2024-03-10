import { SpotifyProfile } from "@/lib/interfaces";

const clientId: string | undefined = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri: string = 'http://localhost:3000/creator';

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36)).join('').substr(0, length);
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const hashed = await sha256(codeVerifier);
  return base64urlencode(hashed);
}

export async function redirectToAuthCodeFlow(): Promise<void> {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  if (!clientId) {
    console.error('Spotify Client ID is not set');
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: 'user-read-private user-read-email',
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

async function getAccessToken(code: string): Promise<string | null> {
  const codeVerifier = localStorage.getItem('code_verifier') || '';

  if (!clientId) {
    console.error('Spotify Client ID is not set');
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

export async function fetchProfile(token: string): Promise<SpotifyProfile> {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      displayName: data.display_name,
      spotifyId: data.id,
      image: data.images[0]?.url || null,
    };
  } catch (error) {
    console.error('Error fetching Spotify profile:', error);
    return { displayName: null, spotifyId: null, image: null };
  }
}

export async function handleSpotifyAuthCallback(): Promise<SpotifyProfile> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const accessToken = await getAccessToken(code);
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      console.log('Access token:', accessToken);
      return await fetchProfile(accessToken);
    }
  }

  console.error('Error during Spotify auth callback. No code found in URL parameters.');
  return { displayName: null, spotifyId: null, image: null };
}
