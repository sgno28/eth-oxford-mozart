// pages/DeployStorePage.tsx
"use client";
import React from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import { merchandiseSaleContract } from '@/contracts/merchandiseSale'; // Adjust the import path according to your project structure
import { addMerchandiseStoreToCreator } from '@/firebase/firebase-helpers'; // Ensure this function exists to update Firestore
import { Merchandise } from '@/lib/interfaces'
import { getBondContractAddress } from '@/firebase/firebase-helpers';

export default function DeployStorePage() {
  const router = useRouter();

  const deployMerchandiseSaleContract = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('Ethereum provider not found');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const contractFactory = new ethers.ContractFactory(
      merchandiseSaleContract.abi,
      merchandiseSaleContract.bytecode,
      signer
    );

    const revenueShareAddress = getBondContractAddress(userAddress)

    const merchandiseSale = await contractFactory.deploy(revenueShareAddress);
    await merchandiseSale.deployed();

    console.log('MerchandiseSale deployed to:', merchandiseSale.address);

    // Add the contract address to Firestore under the creator's object
    const creatorAddress = await signer.getAddress();
    console.log('Creator address:', creatorAddress);

    const merchandise: Merchandise = {
        contract_address: merchandiseSale.address,
        merchItems: [],
        creatorName: '',
    };

    await addMerchandiseStoreToCreator(creatorAddress, merchandise);

    // Route back to /creators
    router.push('/creator');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={deployMerchandiseSaleContract}>Deploy Store</Button>
    </div>
  );
};
