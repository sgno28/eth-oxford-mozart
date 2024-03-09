const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // Redirect to Spotify authorization page
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}


function generateCodeVerifier(length: number) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(
  clientId: string,
  code: string
): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000");
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

export async function fetchProfile(token: string): Promise<any> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const res = await result.json()
  console.log(res)

  return res
}

export async function signUpAsArtist(token: string, clientId: string) {
  // Fetch user profile
  const profile = await fetchProfile(token);

  // Extract user's URI and name from the profile
  const { uri, display_name } = profile;

  // Perform signup process using the user's URI and name
  // This could involve making a POST request to your backend API endpoint
  // to sign up the user as an artist and providing their URI and name
  // Example:
  // await fetch("http://your-backend-api/signup", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ uri, name: display_name }),
  // });

  // Redirect to the signup page
  window.location.href = "http://localhost:3000";
}

export async function handleSpotifyAuthCallback(clientId: string) {
  console.log("handleSpotifyAuthCallback called");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (code && clientId) {
    try {
      const accessToken = await getAccessToken(clientId, code);
      const profile = await fetchProfile(accessToken);
      console.log("Name:", profile.display_name);
      console.log("Spotify ID:", profile.id);
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Error: No authorization code or client ID provided.");
  }
}