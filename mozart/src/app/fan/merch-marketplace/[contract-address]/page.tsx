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
import { revenueShareContract } from "@/contracts/revenueShare";
import {addPurchasedMerch} from "@/firebase/addPurchasedMerch";


const contractABI = revenueShareContract.abi;

export default function MerchPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const merchAddress = pathSegments[pathSegments.length - 1];
  const [merch, setMerch] = useState<Merchandise | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchMerch = async () => {
      const merchData: Merchandise = await getMerchByContractAddress(merchAddress);
      if (merchData && merchData.merchItems.length > 0) { 
        setMerch(merchData);
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const contract = new ethers.Contract(merchAddress, contractABI, provider);
        const totalSupply = await contract.totalSupply();
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
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          merch.contract_address,
          contractABI,
          signer
        );

        console.log(
          "Purchasing",
          purchaseAmount,
          "merch tokens for price",
          Number(merch.merchItems[0].price) * purchaseAmount,
          "ETH"
        );
        console.log("Contract:", contract.address);
        console.log("Provider:", await signer.getAddress());
        const balance = await provider.getBalance(await signer.getAddress());
        console.log("Balance:", ethers.utils.formatEther(balance));

        // await contract.buyBondTokens(purchaseAmount, { NEED TO EDIT THIS FOR MERCH
        //   value: ethers.utils.parseEther(
        //     (Number(merch.merchItems[0].price) * purchaseAmount).toString()
        //   ),
        // });
        await addPurchasedMerch(
          await signer.getAddress(),
          merchAddress,
          purchaseAmount
        );
        // Handle post-purchase logic here (e.g., update UI, show success message)
      } catch (error) {
        console.error("Purchase failed:", error);
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
