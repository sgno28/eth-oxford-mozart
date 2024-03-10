"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Creator } from "@/lib/interfaces";
import { Card, CardTitle, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import Link from "next/link";

const db = getFirestore(app);

export default function FanPageDiscover({ Creators }: { Creators: Creator[] }) {
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "creators"));
        const creators: Creator[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.image && data.bond) {
            creators.push({
              spotifyId: data.spotifyId || null,
              name: data.name,
              start_date: data.start_date || null,
              followers: data.followers || null,
              web3_wallet: data.web3_wallet || null,
              bond: data.bond,
              image: data.image,
              ticketCollections: data.ticketCollections || null,
              merchandise: data.merchandise || null,
            });
          }
        });

        setCreators(creators);
      } catch (error) {
        console.error("Error fetching creators:", error);
      }
    };

    fetchCreators();
  }, []);

  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Trending Creators
        </h2>
        <p className="text-sm text-muted-foreground">
          Trending Creators we'd think you'd like!
        </p>
        <div className="flex w-full space-x-4 ">
          {creators.map((creator, index) => (
            <TrendingCreators key={index} creator={creator} />
          ))}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight ">
          Top Creators
        </h2>
        <p className="text-sm text-muted-foreground">
          The Top 3 Creators on the platform
        </p>
        <div className="flex flex-row justify-between items-center w-full mt-2 overflow-x-auto">
          {creators.slice(0, 3).map((creator, index) => (
            <TopCreators key={index} creator={creator} />
          ))}
        </div>
      </div>
    </>
  );
}

function TrendingCreators({ creator }: { creator: Creator }) {
  function capitalizeName(name: string) {
    return name
      .split(" ") // Split the name into parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(" "); // Join the parts back together
  }
  return (
    <Link href={`/fan/bond/${creator.bond?.contract_address}`}>
    <Card className="flex flex-col items-center flex-shrink-0 p-4 mt-3 mb-3">
      <img
        src={creator.image || "https://via.placeholder.com/150"}
        alt={creator.name!}
        className="w-25 h-25 object-cover rounded-full mx-auto my-3" // Increased size, added margin, and centered
      />
      <CardTitle className="text-center">
        {capitalizeName(creator.name!)}
      </CardTitle>
      <CardContent className="flex items-center justify-center space-x-4 pt-3">
        <div>
          <p>{creator.bond?.principal_fee} XTZ</p>
        </div>
        <div>
          <p>{(creator.bond?.revenue_share || 0) * 100}%</p>
        </div>
        <div>
          <p>{creator.bond?.coupon_interval} Months</p>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

function TopCreators({ creator }: { creator: Creator }) {
  function capitalizeName(name: string) {
    return name
      .split(" ") // Split the name into parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(" "); // Join the parts back together
  }
  return (
    
    <Link href={`/fan/bond/${creator.bond?.contract_address}`}>
      <div className="flex-none" style={{ minWidth: "350px", marginRight: "20px" }}>
        <Card className="flex flex-col justify-between items-center flex-shrink-0 p-10 gap-4" style={{ minHeight: "300px" }}>
          <div className="flex flex-row justify-between items-center w-full">
            <img
              src={creator.image || "https://via.placeholder.com/150"}
              className="w-25 h-25 object-cover rounded-full"
            />
            <div className="flex flex-col justify-center">
              <CardTitle className="text-center mt-6">{creator.name}</CardTitle>
              <CardContent className="text-center pt-3">
                <p>{creator.bond?.principal_fee} XTZ</p>
                <p>{(creator.bond?.revenue_share || 0) * 100}%</p>
                <p>{creator.bond?.coupon_interval} Months</p>
              </CardContent>
            </div>
          </div>
          <Progress value={Math.floor(Math.random() * 100) + 1} className="w-full" />
        </Card>
      
    </div>
    </Link>
  );
}
