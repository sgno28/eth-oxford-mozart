"use client";
import { FunctionComponent, useEffect, useState } from 'react';
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { useMode } from "@/app/contexts/ModeContext";
import { useRouter } from "next/navigation";
import { StoreIcon, TicketIcon, PlusIcon, CandlestickChart, TicketCheckIcon } from "lucide-react";
import { LucideIcon } from "lucide-react/dist/lucide-react";
import { useWallet } from "@/app/contexts/WalletContext";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";
import { ethers } from "ethers";

const db = getFirestore(app);

type SidebarItem = {
  name: string;
  route: string;
  icon: LucideIcon;
};

export function Sidebar() {
  const { mode, setMode } = useMode();
  const router = useRouter();
  const wallet = useWallet(); // Assuming useWallet() returns the wallet object with an address
  const [hasBond, setHasBond] = useState(false);



  useEffect(() => {
    const checkForBond = async () => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const address = await signer.getAddress();

      if (address) {
        const creatorsRef = collection(db, "creators");
        const q = query(creatorsRef, where("web3_wallet", "==", address));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          if (doc.data().bond) {
            setHasBond(true);
          }
        });
      }

      return address;
    };

    checkForBond();
    console.log("Has bond:", hasBond);
  }, [wallet]);

  const fan_routes: SidebarItem[] = [
    { name: "Creator Marketplace", route: "/fan/discover", icon: StoreIcon },
    { name: "Ticket Marketplace", route: "/fan/ticket-marketplace", icon: TicketIcon }
  ];

  const creator_routes: SidebarItem[] = hasBond
    ? [{ name: "Bond Dashboard", route: "/creator/my-bond", icon: CandlestickChart },
       { name: "Create Tickets", route: "/creator/create-tickets", icon: TicketIcon },
       { name: "My Tickets", route: "/creator/my-tickets", icon: TicketCheckIcon }]
    : [{ name: "Add bond", route: "/creator/add-bond", icon: PlusIcon },
       { name: "Create Tickets", route: "/creator/create-tickets", icon: TicketIcon },
       { name: "My Tickets", route: "/creator/my-tickets", icon: TicketCheckIcon }];

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
          <div className="px-3 ">
            <div className="px-4 ">
              <div
                className="cursor-pointer"
                onClick={() => {
                  const targetPath =
                    mode === "Fan" ? "/fan/my-creators" : "/creator/my-bond";
                  router.push(targetPath);
                }}
              >
                <h2 className="text-lg font-semibold tracking-tight">
                  My {mode === "Fan" ? "Creators" : "Fans"}
                </h2>
                <p className="italic">{mode} View</p>
              </div>

              <div className="pt-8">
                <ConnectWalletButton></ConnectWalletButton>
              </div>
            </div>
          </div>

          <Separator className="horizontal my-2"></Separator>
          <div className="space-y-1 px-3">
            {mode === "Fan"
              ? fan_routes.map((route: SidebarItem) => (
                  <Button
                    key={route.route}
                    variant="secondary"
                    className="w-full justify-start mb-1"
                    onClick={() => router.push(route.route)}
                  >
                    <route.icon className="mr-2"/>
                    {route.name}
                  </Button>
                ))
              : creator_routes.map((route: SidebarItem) => (
                  <Button
                    key={route.name}
                    variant="secondary"
                    className="w-full justify-start mb-1"
                    onClick={() => router.push(route.route)}
                  >
                    <route.icon className="mr-2"/>
                    {route.name}
                  </Button>
                ))}
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