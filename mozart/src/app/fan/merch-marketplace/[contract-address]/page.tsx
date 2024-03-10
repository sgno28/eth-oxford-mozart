"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Merchandise } from "@/lib/interfaces";
import { getMerchByContractAddress } from "@/firebase/firebase-helpers";
import { merchandiseSaleContract } from "@/contracts/merchandiseSale";
import {addPurchasedMerch} from "@/firebase/addPurchasedMerch";
import { useWallet } from "@/app/contexts/WalletContext";


const contractABI = merchandiseSaleContract.abi;

export default function MerchPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const merchAddress = pathSegments[pathSegments.length - 1];
  const [merch, setMerch] = useState<Merchandise | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [progress, setProgress] = useState(0);
  const { walletAddress } = useWallet();

  useEffect(() => {
    const fetchMerch = async () => {
      const merchData: Merchandise = await getMerchByContractAddress(merchAddress);
      if (merchData && merchData.merchItems.length > 0) { 
        setMerch(merchData);
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const contract = new ethers.Contract(merchAddress, contractABI, provider);
        const totalSupply = await contract.nextItemId();
        // Ensure supplyCap is a number and not undefined
        const supplyCap = Number(merchData.merchItems[0].supplyCap);
        if (!isNaN(supplyCap) && supplyCap > 0) { // Check that supplyCap is a number and greater than 0
          const progressValue = (totalSupply.toNumber() / supplyCap) * 100;
          setProgress(progressValue);
        }
      }
    };
  
    fetchMerch();
  }, [merchAddress]);
  

  const handlePurchase = async () => {
    if (merch && purchaseAmount > 0) {
      try {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(merchAddress, contractABI, signer);
    
        const itemId = 1; // Assuming you're purchasing the first item
        const pricePerItem = ethers.utils.parseEther(merch.merchItems[0].price.toString());
        const totalPrice = pricePerItem.mul(purchaseAmount);

        console.log(`Address: ${merchAddress}`)
    
        console.log(`Purchasing item with ID ${itemId} for total price ${ethers.utils.formatEther(totalPrice)} ETH`);

        console.log('test')
        const revenueAddress = await contract.revenueShareAddress();
        console.log(`Revenue Address: ${revenueAddress}`);
    
        await contract.purchaseItem(itemId, { value: totalPrice});
    
        await addPurchasedMerch(
          walletAddress,
          merchAddress,
          purchaseAmount
        );
    
        // Update UI, show success message, etc.
      } catch (error) {
        console.error("Purchase failed:", error);
        // Handle the error state in the UI, inform the user
      }
    }
  };
  
  

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {merch && (
        <div className="pt-20">
          <Card>
            <CardHeader>
              <CardTitle>{merch.contract_address}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Price: {merch.merchItems[0].price} ETH</CardDescription>
              <CardDescription>Supply Cap: {merch.merchItems[0].supplyCap}</CardDescription>
              <CardDescription>
                Sold: {merch.merchItems[0].sold}
              </CardDescription>
              <Progress value={progress} max={100} />
            </CardContent>
          </Card>
        </div>
      )}
      <Label>
        Amount to Purchase:
        <Input
          className="mt-2"
          type="number"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(Number(e.target.value))}
          min="1"
        />
      </Label>
      <Button onClick={handlePurchase}>Buy</Button>
    </div>
  );
}
