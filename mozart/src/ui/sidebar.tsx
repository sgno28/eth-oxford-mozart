"use client";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { useMode } from "@/app/contexts/ModeContext";
import { useRouter } from "next/navigation";
import React from "react";
import { FunctionComponent } from "react";
import { useWallet } from "@/app/contexts/WalletContext";

export function Sidebar() {
  const { mode, setMode } = useMode();
  const router = useRouter();

  const toggleMode = () => {
    const newMode = mode === "Fan" ? "Creator" : "Fan";
    setMode(newMode);

    const targetPath = newMode === "Fan" ? "/fan" : "/creator";
    router.push(targetPath);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto py-4 space-y-4">
        <div className="py-2">
          <div
            className="px-3 cursor-pointer"
            onClick={() => {
              const targetPath =
                mode === "Fan" ? "/fan/my-creators" : "/creator/my-bond";
              router.push(targetPath);
            }}
          >
            <div className="px-4 ">
              <h2 className="text-lg font-semibold tracking-tight">
                My {mode === "Fan" ? "Creators" : "Fans"}
              </h2>
              <p className="italic">{mode} View</p>
              <div className="py-3">
                <ConnectWalletButton></ConnectWalletButton>
              </div>
            </div>
          </div>

          <Separator className="horizontal my-2"></Separator>
          <div className="space-y-1 px-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push("/fan/discover")} // Redirects to the Discover page
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Discover
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 py-6 flex justify-center items-center">
        <p className="px-2">Switch Mode</p>
        <div
          onClick={toggleMode}
          className="border rounded-md cursor-pointer overflow-hidden flex"
        >
          <div
            className={`flex-1 text-center py-2 px-2 ${
              mode === "Fan" ? "bg-black text-white" : "text-gray-800"
            }`}
          >
            Fan
          </div>
          <div
            className={`flex-1 text-center py-2 px-2 ${
              mode === "Creator" ? "bg-black text-white" : "text-gray-800"
            }`}
          >
            Creator
          </div>
        </div>
      </div>
    </div>
  );
}

const ConnectWalletButton: FunctionComponent = () => {
  const { walletButtonText, isWalletConnected, handleWalletLink } = useWallet();

  function formatWalletAddress(address: string) {
    if (!address || address.length < 8) return address;
    const start = address.substring(0, 5);
    const end = address.substring(address.length - 10);
    return `${start}...${end}`;
  }

  return (
    <Button
      type="button"
      onClick={handleWalletLink}
      disabled={isWalletConnected}
    >
      <p className="text-xs">
        {isWalletConnected
          ? formatWalletAddress(walletButtonText)
          : walletButtonText}
      </p>
    </Button>
  );
};

const fan_routes: string[] = ["/fan/discover"];
const creator_routes: string[] = [""];
