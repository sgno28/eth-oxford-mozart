import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      (async () => {
        const profile: SpotifyProfile = await handleSpotifyAuthCallback(
          spotifyClientId!
        );
        if (profile) {
          console.log("Spotify profile fetched:", profile);
          setSpotifyProfile(profile);
          setIsSpotifyConnected(true);
          setWalletButtonText("Wallet Connected");
          if (isWalletConnected && walletAddress) {
            const params: Creator = {
              spotifyId: profile.spotifyId,
              name: profile.displayName,
              start_date: null,
              followers: null,
              web3_wallet: walletAddress,
              bond: null,
              image: profile.image,
            };
            addCreator(params);
          }
        }
      })();
    }
  }, []);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletButtonText, setWalletButtonText] = useState("Link Wallet");
  const [spotifyButtonText, setSpotifyButtonText] = useState("Link Spotify");
  const [spotifyProfile, setSpotifyProfile] = useState<SpotifyProfile | null>(
    null
  );

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
          addCreator({
            spotifyId: spotifyProfile.spotifyId,
            name: spotifyProfile.displayName,
            image: spotifyProfile.profileImage,
            walletAddress: accounts[0],
          });
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("Wallet is not installed!");
    }
  };

  const onSubmit = (event) => {
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
