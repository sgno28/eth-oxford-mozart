import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "@/ui/button";
import {
  handleSpotifyAuthCallback,
  redirectToAuthCodeFlow,
} from "@/services/spotifyFetch";
import { addCreator } from "@/firebase/addCreator";
import { Creator, SpotifyProfile } from "../lib/interfaces";
import { useWallet } from "@/app/contexts/WalletContext";

const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;


export function CreatorSignup() {
  // State to track Spotify connection
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  const [spotifyButtonText, setSpotifyButtonText] = useState("Link Spotify");
  const [spotifyProfile, setSpotifyProfile] = useState<SpotifyProfile | null>(
    null
  );
  const { isWalletConnected, walletAddress, walletButtonText } = useWallet();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    console.log("wallet initial", isWalletConnected);
    if (code && !isSpotifyConnected && !spotifyProfile) {
      (async () => {
        const profile: SpotifyProfile | null = await handleSpotifyAuthCallback(
          spotifyClientId!
        );
        console.log("Spotify profile fetched:", profile);

        if (profile && profile.spotifyId && isWalletConnected) {
          console.log("Spotify profile fetched:", profile);
          setSpotifyProfile(profile);
          setIsSpotifyConnected(true);
          setSpotifyButtonText("Spotify Connected");
          addCreator({
            spotifyId: profile.spotifyId,
            name: profile.displayName,
            start_date: null,
            followers: null,
            web3_wallet: walletAddress,
            bond: null,
            image: profile.image || null,
            ticketCollections: [],
          });
          // Clear the code from the URL
          const newUrl = window.location.pathname;
          window.history.pushState({}, "", newUrl);
        }
        console.log(isSpotifyConnected, profile, isWalletConnected);
      })();
    }
  }, [isSpotifyConnected, spotifyProfile]);

  const handleSpotifyAuth = () => {
    redirectToAuthCodeFlow(spotifyClientId!);
  };

  const SpotifyButton = () => {
    return (
      <Button
        type="button"
        onClick={handleSpotifyAuth}
        className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center p-2 rounded"
      >
        <svg
          className="w-6 h-6 mr-2"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path fill="#ffffff" d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/>
        </svg>
        {spotifyButtonText}
      </Button>
    );
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from submitting
    console.log("Form submission logic placeholder.");
  };

  return (
    <div className="space-y-4 flex justify-center items-center flex-col">
      <p>Connect to Spotify and your wallet to get started.</p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <SpotifyButton/>
      </form>
    </div>
  );
}
