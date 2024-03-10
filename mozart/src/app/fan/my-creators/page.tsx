"use client";
import { Bond } from "@/lib/interfaces";
import Link from "next/link";
import { Separator } from "@/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";
import { fetchMyBonds } from "@/firebase/fetchMyBonds";
import { useState, useEffect } from "react";
import { useWallet } from "@/app/contexts/WalletContext";
import { BondDetails } from "@/lib/interfaces";

export default function MyCreators() {
  // Initialize state to hold fetched bonds
  const [bonds, setBonds] = useState<BondDetails[]>([]);
  const { walletAddress } = useWallet();
  // Assuming 'fan_address' is available. Replace 'your_fan_address' with actual fan address.
  const fan_address = walletAddress;

  useEffect(() => {
    // Fetch bonds when the component mounts
    const fetchData = async () => {
      const fetchedBonds = await fetchMyBonds(fan_address);
      console.log(fetchedBonds);
      setBonds(fetchedBonds);
    };


    fetchData();
  }, [fan_address]); // Depend on fan_address to refetch if it changes

  return (
    <div className="px-5 py-2">
      <h2 className="text-2xl font-semibold tracking-tight">
        Creator Bonds Purchased
      </h2>
      <p>View all of your currently purchased bonds</p>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bonds.map((bond, index) => (
          <BondCard key={index} bond={bond} />
        ))}
      </div>
    </div>
  );
}
function BondCard({ bond }: { bond: BondDetails }) {
  return (
    <Link href={`/fan/bond/${bond.bond_address}`}>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {bond.bond_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Price: {bond.principal_fee} ETH</CardDescription>
          <CardDescription>Supply Cap: {bond.supplyCap}</CardDescription>
          <CardDescription>
            Revenue Share: {bond.revenue_share}%
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
