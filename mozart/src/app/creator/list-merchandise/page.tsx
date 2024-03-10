// pages/creator/list-merchandise.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ethers } from 'ethers';
import { merchandiseSaleContract } from '@/contracts/merchandiseSale'; // Adjust the import path as necessary
import { getFirestore, collection, where, query, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/ui/form";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Merchandise, MerchItem } from '@/lib/interfaces';
import { addMerchandiseStoreToCreator } from '@/firebase/firebase-helpers';

const merchandiseItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.string().min(1, "Price is required").regex(/^\d+(\.\d+)?$/, "Invalid price format"),
    supplyCap: z.string().min(1, "Supply Cap is required").regex(/^\d+$/, "Supply Cap must be a whole number"),
});


const db = getFirestore(app);

export default function ListMerchandisePage() {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
      resolver: zodResolver(merchandiseItemSchema),
    });

    const router = useRouter();
    const form = useForm({
      resolver: zodResolver(merchandiseItemSchema)
    });
  
    const [merchandiseContract, setMerchandiseContract] = useState<ethers.Contract | null>(null);
  
  useEffect(() => {
    const initContract = async () => {
      if (!(window as any).ethereum) {
        console.error("Ethereum object not found, you need to install MetaMask!");
        return;
      }
  
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const web3Wallet = await signer.getAddress();
  
      const creatorsRef = collection(db, "creators");
      const q = query(creatorsRef, where("web3_wallet", "==", web3Wallet));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.error("Creator not found in Firestore");
        return;
      }
  
      const creatorData = querySnapshot.docs[0].data();
      if (!creatorData.merchandiseStore) {
        console.error("Merchandise store address not found for creator");
        return;
      }
  
      const contract = new ethers.Contract(creatorData.merchandiseStore, merchandiseSaleContract.abi, signer);
      setMerchandiseContract(contract);
    };
  
    initContract();
  }, []);

  
  const onSubmit = async (data: any) => {
    console.log(data);
    console.log(`Address: ${merchandiseContract!.address}`)
    if (!merchandiseContract) {
      console.error("Merchandise contract not initialized");
      return;
    }

    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const web3Wallet = await signer.getAddress();

    try {
      const transaction = await merchandiseContract.addItem(
        data.name,
        ethers.utils.parseEther(data.price), // Convert the price from ETH to Wei
        parseInt(data.supplyCap)
      );

      await transaction.wait(); // Wait for the transaction to be mined
      console.log("Merchandise item added successfully");

      const merchItem: MerchItem = {
        name: data.name,
        price: data.price,
        supplyCap: data.supplyCap,
        sold: 0,
        isActive: true,
      };

      const merchandise: Merchandise = {
        contract_address: merchandiseContract.address,
        merchItems: [merchItem],
      }
      
      await addMerchandiseStoreToCreator(web3Wallet, merchandise)
      router.push('/creator'); // Adjust this path as needed
    } catch (error) {
      console.error("Failed to add merchandise item", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">List Merchandise Item</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem className="mb-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Item Name" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem className="mb-3">
                <FormLabel>Merch price (ETH)</FormLabel>
                <FormControl>
                    <Input type="number" {...field} placeholder="0.05" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            <FormField name="supplyCap" control={form.control} render={({ field }) => (
                <FormItem className="mb-3">
                <FormLabel>Supply Cap</FormLabel>
                <FormControl>
                    <Input type="number" {...field} placeholder="1000" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />
            <Button type="submit">Add Item</Button>
        </form>
      </Form>
    </div>
  );
}