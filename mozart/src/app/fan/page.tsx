"use client";

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
          });
        }
      });

      setTrendingCreators(creators);
    };

    fetchTrendingCreators();
  }, []);

  return (
    <div>
      <FanPageDiscover Creators={dummy_creators}></FanPageDiscover>
    </div>
  );
}

const dummy_creator_creator_bond: Bond = {
  contract_address: "0x1",
  creator: "firstname lastname",
  principal_fee: 50,
  revenue_share: 0.01,
  expiry_date: 1712711617,
  coupon_interval: 5,
  supplyCap: 50,
};

const dummy_creator: Creator = {
  spotifyId: "c1",
  name: "test",
  start_date: 1704852817,
  followers: null,
  web3_wallet: "0x1",
  bond: dummy_creator_creator_bond,
  image: null,
};

const dummy_creators: Creator[] = [
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
  dummy_creator,
];
