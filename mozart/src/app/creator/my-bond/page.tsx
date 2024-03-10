"use client";
import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Separator } from "@/ui/separator";
import { ethers } from "ethers";
import { Bond } from "@/lib/interfaces";
import { revenueShareContract } from '@/contracts/revenueShare';

const db = getFirestore(app);
const contractABI = revenueShareContract.abi;

interface BondWithProgress extends Bond {
  progress?: number;
}

export default function MyBond() {
  const [bond, setBond] = useState<BondWithProgress | null>(null);

  useEffect(() => {
    const fetchBond = async () => {
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
          const bondData = docData.bond as Bond;

          if (bondData) {
            const contract = new ethers.Contract(bondData.contract_address, contractABI, provider);
            const totalSupply = await contract.totalSupply();
            const progressValue = (20 / bondData.supplyCap) * 100;
            
            setBond({ ...bondData, progress: progressValue });
          }
        }
      }
    };

    fetchBond();
  }, []);

  

  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight">My Active Bond</h2>
        <Separator className="my-4" />
        {bond && (
          <Card className="w-fit h-auto">
            <CardHeader>
              <CardTitle>{bond.contract_address}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Principal Fee: {bond.principal_fee}</CardDescription>
              <CardDescription>Revenue Share: {bond.revenue_share}%</CardDescription>
              <Progress className="mt-1" value={bond.progress || 0} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
