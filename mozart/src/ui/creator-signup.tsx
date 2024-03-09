import React from 'react';
import { Button } from '@/ui/button';
import { redirectToAuthCodeFlow } from '../services/spotifyFetch';

function CreatorSignup() {
  // Handler for Spotify authentication
  const handleSpotifyAuth = () => {
    redirectToAuthCodeFlow(process.env.REACT_APP_SPOTIFY_CLIENT_ID as string);
  };

  // Handler for MetaMask linking
  const handleMetamaskLink = async () => {
    // Ensure TypeScript knows about `window.ethereum`
    if (window.ethereum) {
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Accounts now exposed, can use the public address to sign in
        console.log('Connected account:', accounts[0]);
        // Proceed with any further logic, e.g., redirecting to the dashboard or storing the account
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.log('MetaMask is not installed!');
    }
  };

  // Form submission handler
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from submitting
    console.log('Form submission logic placeholder.');
  };

  return (
    <div className="space-y-8">
      <p>Please connect to both Spotify and MetaMask to proceed to your dashboard.</p>
      <form onSubmit={onSubmit}>
        <Button type="button" onClick={handleSpotifyAuth}>Connect with Spotify</Button>
        <Button type="button" onClick={handleMetamaskLink}>Link Metamask</Button>
        {/* Placeholder for future form elements or actions */}
      </form>
    </div>
  );
}

export default CreatorSignup;