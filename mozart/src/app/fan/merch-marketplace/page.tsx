"use client";

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import MerchDiscover from "@/ui/merch-discover";

const db = getFirestore(app);

export default function Fan() {
  return (
    <div>
      <MerchDiscover />
    </div>
  );
}

// const dummy_creator_bond: Bond = {
//   contract_address: "0x1",
//   creator: "0x2",
//   principal_fee: 50,
//   revenue_share: 0.01,
//   expiry_date: 1712711617,
//   coupon_interval: 5,
//   supplyCap: 50,
// };

// const dummy_creator: Creator = {
//   spotifyId: "c1",
//   name: "test",
//   start_date: 1704852817,
//   followers: null,
//   web3_wallet: "0x1",
//   bond: dummy_creator_bond,
//   image: null,
//   ticketCollections: [],
// };

// const dummy_creators: Creator[] = [
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
//   dummy_creator,
// ];
