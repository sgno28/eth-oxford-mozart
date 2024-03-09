import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "@/ui/button";
import {
  handleSpotifyAuthCallback,
  redirectToAuthCodeFlow,
} from "@/services/spotifyFetch";
import { addCreator } from "@/firebase/addCreator";
import { Creator, SpotifyProfile } from "../lib/interfaces";

const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export function CreatorSignup() {
  // State to track Spotify connection
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletButtonText, setWalletButtonText] = useState("Link Wallet");
  const [spotifyButtonText, setSpotifyButtonText] = useState("Link Spotify");
  const [spotifyProfile, setSpotifyProfile] = useState<SpotifyProfile | null>(
    null
  );

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code && !isSpotifyConnected && !spotifyProfile) { 
      (async () => {
        const profile: SpotifyProfile | null = await handleSpotifyAuthCallback(spotifyClientId!);
        if (profile && profile.spotifyId) { 
          console.log("Spotify profile fetched:", profile);
          setSpotifyProfile(profile);
          setIsSpotifyConnected(true);
          setSpotifyButtonText("Spotify Connected");
          
          // Clear the code from the URL
          const newUrl = window.location.pathname;
          window.history.pushState({}, '', newUrl);
        }
      })();
    }
  }, [isSpotifyConnected, spotifyProfile]);
  
  const handleSpotifyAuth = () => {
    redirectToAuthCodeFlow(spotifyClientId!);
  };

  const handleWalletLink = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected wallet account:", accounts[0]);
        setWalletAddress(accounts[0]); // Update the walletAddress state
        setIsWalletConnected(true);
        setWalletButtonText("Wallet Connected");
        if (isSpotifyConnected && spotifyProfile) {
            console.log("I have penetrated");
            console.log(spotifyProfile);
          addCreator({
            spotifyId: spotifyProfile.spotifyId,
            name: spotifyProfile.displayName,
            start_date: null,
            followers: null,
            web3_wallet: walletAddress,
            bond: null,
            image: spotifyProfile.image,
          });
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("Wallet is not installed!");
    }
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
        {isSpotifyConnected && (
          <Button
            type="button"
            onClick={handleWalletLink}
            disabled={isWalletConnected}
          >
            {walletButtonText}
          </Button>
        )}
      </form>
    </div>
  );
}
