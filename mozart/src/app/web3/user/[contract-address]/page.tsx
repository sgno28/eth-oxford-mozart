"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { revenueShareContract } from "@/contracts/revenueShare";
import { Button } from "@/ui/button";

export default function UserPage() {
    const pathname = usePathname(); // Use usePathname to access the current pathname
    const pathSegments = pathname.split('/'); // Split the pathname into segments
    const address = pathSegments[pathSegments.length - 1]; // Assuming the contract address is the last segment
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        if (!address) {
            console.log("No address found in search params");
            return;
        }
        console.log(`Address: ${address}`);

        if (!(window as any).ethereum) {
            console.log("Ethereum provider not available");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const deployedContract = new ethers.Contract(address, revenueShareContract.abi, signer);
            console.log("Contract initialized:", deployedContract);
            setContract(deployedContract);
        } catch (error) {
            console.error("Error initializing contract:", error);
        }
    }, [address]);

    async function buyToken() {
        if (!contract) return;
        try {
            const transaction = await contract.buyBondTokens(1, {
                value: ethers.utils.parseEther("0.05")
            });
            await transaction.wait();
            console.log("Token bought successfully");
        } catch (error) {
            console.error("Error buying token:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Button onClick={buyToken} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Buy Token
            </Button>
        </div>
    );
}
