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
            merchandise: [],
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

  const SoundCloudButton = () => {
    // Add any click handler or state you need for SoundCloud authentication
    const handleSoundCloudAuth = () => {
      console.log("Handle SoundCloud Authentication");
    };
  
    return (
      <Button
        type="button"
        onClick={handleSoundCloudAuth}
        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center p-2 rounded ml-2"
      >
      <svg fill="#000000" height="50px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_526_"> <path id="XMLID_527_" d="M14.492,208.896c0.619,0,1.143-0.509,1.232-1.226l3.365-26.671l-3.355-27.278 c-0.1-0.717-0.623-1.23-1.242-1.23c-0.635,0-1.176,0.524-1.26,1.23l-2.941,27.278l2.941,26.662 C13.316,208.377,13.857,208.896,14.492,208.896z"></path> <path id="XMLID_530_" d="M3.397,198.752c0.608,0,1.101-0.473,1.19-1.18l2.608-16.574l-2.608-16.884 c-0.09-0.685-0.582-1.18-1.19-1.18c-0.635,0-1.127,0.495-1.217,1.19L0,180.999l2.18,16.569 C2.27,198.269,2.762,198.752,3.397,198.752z"></path> <path id="XMLID_531_" d="M27.762,148.644c-0.08-0.867-0.715-1.5-1.503-1.5c-0.782,0-1.418,0.633-1.491,1.5l-2.811,32.355 l2.811,31.174c0.073,0.862,0.709,1.487,1.491,1.487c0.788,0,1.423-0.625,1.503-1.487l3.18-31.174L27.762,148.644z"></path> <path id="XMLID_532_" d="M38.152,214.916c0.922,0,1.668-0.759,1.758-1.751l3.005-32.156l-3.005-33.258 c-0.09-0.999-0.836-1.749-1.758-1.749c-0.935,0-1.692,0.751-1.756,1.754l-2.656,33.253l2.656,32.156 C36.46,214.158,37.217,214.916,38.152,214.916z"></path> <path id="XMLID_533_" d="M50.127,215.438c1.074,0,1.936-0.86,2.025-2.011l-0.01,0.008l2.83-32.426l-2.83-30.857 c-0.08-1.132-0.941-2.005-2.016-2.005c-1.09,0-1.947,0.873-2.012,2.014l-2.502,30.849l2.502,32.418 C48.18,214.578,49.037,215.438,50.127,215.438z"></path> <path id="XMLID_534_" d="M67.132,181.017l-2.655-50.172c-0.074-1.272-1.065-2.286-2.281-2.286c-1.207,0-2.195,1.013-2.269,2.286 l-2.35,50.172l2.35,32.418c0.074,1.278,1.063,2.278,2.269,2.278c1.217,0,2.207-1,2.281-2.278v0.009L67.132,181.017z"></path> <path id="XMLID_535_" d="M74.386,215.766c1.339,0,2.45-1.111,2.513-2.529v0.021l2.482-32.233l-2.482-61.656 c-0.063-1.418-1.174-2.529-2.513-2.529c-1.37,0-2.471,1.111-2.545,2.529l-2.185,61.656l2.195,32.222 C71.915,214.655,73.016,215.766,74.386,215.766z"></path> <path id="XMLID_536_" d="M86.645,111.435c-1.508,0-2.725,1.238-2.787,2.799l-2.033,66.801l2.033,31.884 c0.063,1.553,1.279,2.783,2.787,2.783c1.504,0,2.73-1.22,2.783-2.788v0.016l2.307-31.895l-2.307-66.801 C89.375,112.663,88.148,111.435,86.645,111.435z"></path> <path id="XMLID_782_" d="M99.01,215.766c1.656,0,2.975-1.336,3.037-3.056v0.019l2.133-31.693l-2.133-69.045 c-0.063-1.714-1.381-3.056-3.037-3.056c-1.666,0-3.005,1.342-3.031,3.056l-1.916,69.045l1.916,31.693 C96.005,214.43,97.344,215.766,99.01,215.766z"></path> <path id="XMLID_783_" d="M111.477,215.734c1.787,0,3.237-1.463,3.291-3.318v0.029l1.963-31.404l-1.963-67.289 c-0.054-1.854-1.504-3.311-3.291-3.311c-1.8,0-3.25,1.456-3.303,3.311l-1.725,67.289l1.736,31.389 C108.227,214.271,109.677,215.734,111.477,215.734z"></path> <path id="XMLID_784_" d="M129.359,181.041l-1.777-64.836c-0.043-2-1.609-3.571-3.551-3.571c-1.947,0-3.514,1.571-3.555,3.584 l-1.594,64.823l1.594,31.198c0.041,1.984,1.607,3.556,3.555,3.556c1.941,0,3.508-1.572,3.551-3.585v0.029L129.359,181.041z"></path> <path id="XMLID_785_" d="M136.682,215.853c2.064,0,3.773-1.717,3.805-3.828v0.017l1.613-30.984l-1.613-77.153 c-0.031-2.119-1.74-3.833-3.805-3.833c-2.063,0-3.767,1.722-3.809,3.844l-1.434,77.111l1.434,31.016 C132.915,214.136,134.619,215.853,136.682,215.853z"></path> <path id="XMLID_786_" d="M149.291,92.814c-2.229,0-4.037,1.849-4.074,4.103l-1.667,84.151l1.677,30.526 c0.027,2.225,1.836,4.068,4.064,4.068c2.195,0,4.037-1.844,4.047-4.105v0.037l1.82-30.526l-1.82-84.151 C153.328,94.655,151.486,92.814,149.291,92.814z"></path> <path id="XMLID_787_" d="M160.82,215.882c0.09,0.008,101.623,0.056,102.275,0.056c20.385,0,36.904-16.722,36.904-37.357 c0-20.624-16.52-37.349-36.904-37.349c-5.059,0-9.879,1.034-14.275,2.907c-2.922-33.671-30.815-60.077-64.842-60.077 c-8.318,0-16.429,1.662-23.593,4.469c-2.788,1.09-3.534,2.214-3.556,4.392v118.539C156.861,213.752,158.607,215.655,160.82,215.882 z"></path> </g> </g></svg>
       <p className="ml-1">SoundCloud</p>
      </Button>
    );
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form from submitting
    console.log("Form submission logic placeholder.");
  };

  return (
    <div className="space-y-8 flex justify-center items-center flex-col">
      <p>Connect to Spotify and your wallet to get started.</p>
      <form onSubmit={onSubmit} className="flex flex-col items-center space-y-4">
        <div className="flex">
          <SpotifyButton />
          <SoundCloudButton />
        </div>
      </form>
    </div>
  );
}
