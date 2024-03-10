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
import { getBondByContractAddress } from "@/firebase/firebase-helpers";
import { Bond } from "@/lib/interfaces";
import { revenueShareContract } from "@/contracts/revenueShare";
import { addPurchasedBond } from "@/firebase/addPurchasedBond";

const contractABI = revenueShareContract.abi;

export default function BondPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const bondAddress = pathSegments[pathSegments.length - 1];
  const [bond, setBond] = useState<Bond | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBond = async () => {
      const bondData: Bond = await getBondByContractAddress(bondAddress);
      setBond(bondData);
      // Placeholder for fetching total supply and calculating progress
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const contract = new ethers.Contract(bondAddress, contractABI, provider);
      const totalSupply = await contract.totalSupply();
      const progressValue = (totalSupply.toNumber() / bondData.supplyCap) * 100;
      setProgress(progressValue);
    };

    fetchBond();
  }, [bondAddress]);

  const handlePurchase = async () => {
    if (bond && purchaseAmount > 0) {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          bond.contract_address,
          contractABI,
          signer
        );

        console.log(
          "Purchasing",
          purchaseAmount,
          "bond tokens for price",
          bond.principal_fee * purchaseAmount,
          "ETH"
        );
        console.log("Contract:", contract.address);
        console.log("Provider:", await signer.getAddress());
        const balance = await provider.getBalance(await signer.getAddress());
        console.log("Balance:", ethers.utils.formatEther(balance));

        await contract.buyBondTokens(purchaseAmount, {
          value: ethers.utils.parseEther(
            (bond.principal_fee * purchaseAmount).toString()
          ),
        });
        await addPurchasedBond(
          await signer.getAddress(),
          bondAddress,
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
      {bond && (
        <div className="pt-20">
          <Card>
            <CardHeader>
              <CardTitle>{bond.contract_address}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Price: {bond.principal_fee} ETH</CardDescription>
              <CardDescription>Supply Cap: {bond.supplyCap}</CardDescription>
              <CardDescription>
                Revenue Share: {bond.revenue_share}%
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
