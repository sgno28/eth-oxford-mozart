import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Merchandise, TicketCollection } from "@/lib/interfaces";
import { Card, CardTitle, CardContent } from "@/ui/card";
import Link from "next/link";

const db = getFirestore(app);

export default function MerchDiscover() {
  const [merch, setMerch] = useState<Merchandise[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "creators"));
        
        const fetchedMerch: Merchandise[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          if (data.merchandise && data.merchandise.merchItems) {
            fetchedMerch.push({
              contract_address: data.contract_address || null,
              merchItems: data.merchandise.merchItems,
              creatorName: data.name,
            });
          }
        });

        setMerch(fetchedMerch);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Adjusted Card Layout for Tickets and Merchandise
  const cardLayout = "flex flex-col items-center p-4 max-w-xs w-full"; // Setting a max-width and full width for consistent sizing
  const imageLayout = "w-24 h-24 object-cover rounded-full"; // Consistent image size

  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight pt-3">Merchandise</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {merch.map((merch, index) => (
            <TrendingMerch key={index} merch={merch} cardLayout={cardLayout} imageLayout={imageLayout} />
          ))}
        </div>
      </div>
    </>
  );
}

function TrendingMerch({ merch, cardLayout, imageLayout }: { merch: Merchandise, cardLayout: string, imageLayout: string }) {
  return (
    <Link href={`/fan/ticket-marketplace/${merch.contract_address}`}>
        <Card className={cardLayout}>
        <CardTitle className="text-center">{merch.creatorName || "Unknown Artist"}</CardTitle>
        {(merch.merchItems || []).map((item, index) => (
            <div key={index} className="my-2 text-center">
            <p>{item.name} - {item.price}</p>
            <p>Supply Cap: {item.supplyCap}, Sold: {item.sold ?? 0}</p>
            </div>
        ))}
        </Card>
    </Link>
  );
}
