// AddBondPage.tsx
"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Slider } from '@/ui/slider';
import { Button } from '@/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/popover';
import { Calendar } from '@/ui/calendar';
import { ethers } from 'ethers';
import { revenueShareContract } from '@/contracts/revenueShare';
import { format } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addBondToCreator } from '@/firebase/firebase-helpers';
import { Bond } from '@/lib/interfaces';

const addBondSchema = z.object({
  name: z.string().min(1, "Bond name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  bondPrice: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, "Bond price must be positive"),
  expiryDate: z.string(), // Handle date transformation in the onSubmit function
  couponIntervalMonths: z.number().min(1, "Coupon interval must be at least 1 month"),
  supplyCap: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, "Supply cap must be positive"),
  revenueSharePercentage: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, "Revenue share percentage must be positive")
});

const AddBondPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(addBondSchema)
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const revenueShareContractABI = revenueShareContract.abi;
  const revenueShareContractBytecode = revenueShareContract.bytecode;

  const onSubmit = async (values: any) => {
    // Additional logic to handle the date conversion
    const expiryTimestamp = new Date(values.expiryDate).getTime() / 1000;
    setIsLoading(true);

    try {
      const { name, symbol, bondPrice, couponIntervalMonths, supplyCap, revenueSharePercentage } = values;
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contractFactory = new ethers.ContractFactory(revenueShareContractABI, revenueShareContractBytecode, signer);
      const contract = await contractFactory.deploy(
        name,
        symbol,
        ethers.utils.parseEther(bondPrice.toString()),
        expiryTimestamp,
        couponIntervalMonths,
        ethers.utils.parseEther(supplyCap.toString()),
        revenueSharePercentage
      );

      await contract.deployed();
      console.log("Contract deployed to:", contract.address);

      const signerAddress = await signer.getAddress();

      const bond: Bond = {
          contract_address: contract.address,
          creator: signerAddress,
          principal_fee: bondPrice,
          revenue_share: revenueSharePercentage,
          expiry_date: expiryTimestamp,
          coupon_interval: couponIntervalMonths,
          supplyCap: supplyCap,
      };

      await addBondToCreator(signerAddress, bond);

      router.push(`/creator`);
    } catch (error) {
      console.error("Failed to deploy contract:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add New Bond</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Bond Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bond Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="symbol" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input {...field} placeholder="SYMBOL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="bondPrice" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Bond Price (ETH)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="0.05" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField name="expiryDate" control={form.control} render={({ field }) => (
        <FormItem className="flex flex-col mb-3">
            <FormLabel>Expiry Date</FormLabel>
            <div style={{ maxWidth: '200px' }}> {/* Set a maximum width here */}
            <Popover>
                <PopoverTrigger asChild>
                <Button className={cn("inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50", !field.value && "text-gray-400")}>
                    {field.value ? format(new Date(field.value), "PPP") : "Select Expiry Date"}
                    <CalendarIcon className="ml-2 h-5 w-5 text-gray-400" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(format(date!, 'yyyy-MM-dd'))}
                />
                </PopoverContent>
            </Popover>
            </div>
            <FormMessage />
        </FormItem>
        )} />
        <FormField name="couponIntervalMonths" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
                <FormLabel>Coupon Interval (Months)</FormLabel>
                <FormControl>
                <Slider min={1} max={12} defaultValue={[6]} onValueChange={(value) => field.onChange(value[0])} />
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
            <FormField name="revenueSharePercentage" control={form.control} render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Revenue Share Percentage</FormLabel>
              <FormControl>
                <Input type="percentage" {...field} placeholder="10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
            <Button className="mt-3" type="submit" disabled={isLoading}>
                {isLoading ? (
                <>
                    <Loader className="animate-spin mr-2" /> Deploying Contract
                </>
                ) : (
                'Create Bond'
                )}
            </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddBondPage;
