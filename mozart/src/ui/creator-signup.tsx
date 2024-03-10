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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from submitting
    console.log("Form submission logic placeholder.");
  };

  return (
    <div className="space-y-8 flex justify-center items-center flex-col">
      <p>Connect to Spotify and your wallet to get started.</p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <Button type="button" onClick={handleSpotifyAuth}>
          {spotifyButtonText}
        </Button>
      </form>
    </div>
  );
}
