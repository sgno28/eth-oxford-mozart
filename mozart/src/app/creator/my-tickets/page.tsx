"use client";
import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { ethers } from "ethers";
import { TicketCollection } from "@/lib/interfaces";
// Import your ticket contract ABI and address here

const db = getFirestore(app);
// const ticketContractABI = ticketContract.abi;

interface TicketCollectionWithDetails extends TicketCollection {
  // Include any additional properties you need, for example, total tickets sold
}

export default function MyTicketCollections() {
  const [ticketCollections, setTicketCollections] = useState<TicketCollectionWithDetails[]>([]);

  useEffect(() => {
    const fetchTicketCollections = async () => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      if (address) {
        const creatorsRef = collection(db, "creators");
        const q = query(creatorsRef, where("web3_wallet", "==", address));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          const ticketCollectionsData = docData.ticketCollections as TicketCollection[];

          // Here you might want to fetch additional details for each ticket collection
          // For example, total tickets sold or available using your ticket contract

          setTicketCollections(ticketCollectionsData);
        }
      }
    };

    fetchTicketCollections();
  }, []);

  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight">My Ticket Collections</h2>
        <Separator className="my-4" />
        {ticketCollections.map((collection, index) => (
          <Card key={index} className="w-fit h-auto mt-2">
            <CardHeader>
              <CardTitle>{collection.address}</CardTitle>
              {/* Add more header info if needed */}
            </CardHeader>
            <CardContent>
              {/* Render your ticket collection details here */}
              <CardDescription>Common IPFS URL: {collection.commonIpfsUrl}</CardDescription>
              {/* Add more content details if needed */}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
