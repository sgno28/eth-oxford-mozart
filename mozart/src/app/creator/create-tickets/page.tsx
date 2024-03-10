"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { ethers } from 'ethers';
import { Loader } from 'lucide-react';
import { addTicketCollectionToCreator, getCreatorRevenueShareAddress } from '@/firebase/firebase-helpers';
import { ticketContract } from '@/contracts/ticket';
import { TicketCollection } from '@/lib/interfaces';

// Define the form schema using zod
const createTicketCollectionSchema = z.object({
  commonIpfsUrl: z.string().min(1, 'Common IPFS URL is required'),
  ticketPrice: z.string().min(0.0001, 'Ticket price must be a positive number')
});

const CreateTicketCollectionPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createTicketCollectionSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialOwner, setInitialOwner] = useState('');
  const [revenueShareAddress, setRevenueShareAddress] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      setInitialOwner(signerAddress);

      const revenueAddress = await getCreatorRevenueShareAddress(signerAddress);
      setRevenueShareAddress(revenueAddress);
    };

    fetchInitialData();
  }, []);

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const { commonIpfsUrl, ticketPrice } = values;

      const revenueShareContractABI = ticketContract.abi;
      const revenueShareContractBytecode = ticketContract.bytecode;

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contractFactory = new ethers.ContractFactory(revenueShareContractABI, revenueShareContractBytecode, signer);
      const contract = await contractFactory.deploy(
        initialOwner,
        revenueShareAddress,
        commonIpfsUrl,
        ethers.utils.parseEther(ticketPrice.toString())
      );

      await contract.deployed();
      console.log("Contract deployed to:", contract.address);

      const ticketCollection: TicketCollection = {
        owner: initialOwner,
        address: contract.address,
        commonIpfsUrl,
        ticketPrice: ticketPrice,
      }


      // Add TicketCollection to Creator in Firestore
      await addTicketCollectionToCreator(initialOwner, ticketCollection);

      router.push('/creator'); // Adjust this path as needed
    } catch (error) {
      console.error('Failed to create ticket collection:', error);
      // Handle errors (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialOwner || !revenueShareAddress) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Create Ticket Collection</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name="commonIpfsUrl" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Common IPFS URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ipfs://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="ticketPrice" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Ticket Price (ETH)</FormLabel>
              <FormControl>
                <Input type="number" step="0.0001" {...field} placeholder="0.1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

            <Button className="mt-2" type="submit" disabled={isLoading}>
                {isLoading ? (
                <>
                    <Loader className="animate-spin mr-2" /> Deploying Contract
                </>
                ) : (
                'Create Ticket'
                )}
            </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTicketCollectionPage;
