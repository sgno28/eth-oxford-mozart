// use client
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebase/firebaseConfig";
import { Creator, Bond } from "@/lib/interfaces";
import FanPageDiscover from "@/ui/fan-page-discover";

const db = getFirestore(app);

export default function Fan() {
  const [trendingCreators, setTrendingCreators] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchTrendingCreators = async () => {
      const querySnapshot = await getDocs(collection(db, "creators"));
      const creators: Creator[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name && data.image) {
          creators.push({
            spotifyId: data.spotifyId || null,
            name: data.name,
            start_date: data.start_date || null,
            followers: data.followers || null,
            web3_wallet: data.web3_wallet || null,
            bond: data.bond || null,
            image: data.image || null,
            ticketCollections: data.ticketCollections || null,
          });
        }
      });

      setTrendingCreators(creators);
    };

    fetchTrendingCreators();
  }, []);

  return (
    <div>
      <FanPageDiscover Creators={trendingCreators} />
    </div>
  );
}
