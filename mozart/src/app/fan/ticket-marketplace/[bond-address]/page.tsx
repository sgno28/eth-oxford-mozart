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
import { TicketCollection } from "@/lib/interfaces";
import { getTicketByContractAddress} from "@/firebase/firebase-helpers";
import { revenueShareContract } from "@/contracts/revenueShare";
import {addPurchasedTicket} from "@/firebase/addPurchasedTicket";


const contractABI = revenueShareContract.abi;

export default function ticketPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const ticketAddress = pathSegments[pathSegments.length - 1];
  const [ticket, setticket] = useState<TicketCollection | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTicket = async () => {
      const ticketData: TicketCollection = await getTicketByContractAddress(ticketAddress);
      setticket(ticketData);
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const contract = new ethers.Contract(ticketAddress, contractABI, provider);
      const totalSupply = await contract.totalSupply();
      // Ensure supplyCap is a number and not undefined
      // const supplyCap = Number(ticketData.ticketItems[0].supplyCap); IS THIS NEEDED??
      // if (!isNaN(supplyCap) && supplyCap > 0) { // Check that supplyCap is a number and greater than 0
      //   const progressValue = (totalSupply.toNumber() / supplyCap) * 100;
      //   setProgress(progressValue);
      // }
    };
  
    fetchTicket();
  }, [ticketAddress]);
  

  const handlePurchase = async () => {
    if (ticket && purchaseAmount > 0) {
      try {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ticket.address,
          contractABI,
          signer
        );

        console.log(
          "Purchasing",
          purchaseAmount,
          "bond tokens for price",
          Number(ticket.ticketPrice) * purchaseAmount,
          "ETH"
        );
        console.log("Contract:", contract.address);
        console.log("Provider:", await signer.getAddress());
        const balance = await provider.getBalance(await signer.getAddress());
        console.log("Balance:", ethers.utils.formatEther(balance));

        await contract.buyBondTokens(purchaseAmount, {
          value: ethers.utils.parseEther(
            (Number(ticket.ticketPrice) * purchaseAmount).toString()
          ),
        });
        await addPurchasedTicket(
          await signer.getAddress(),
          ticketAddress,
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
      {ticket && (
        <div className="pt-20">
          <Card>
            <CardHeader>
              <CardTitle>{ticket.address}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Price: {ticket.ticketPrice} XTZ</CardDescription>
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
