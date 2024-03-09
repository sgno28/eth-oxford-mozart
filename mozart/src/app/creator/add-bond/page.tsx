// AddBondPage.tsx
"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { Slider } from '@/ui/slider';
import { Button } from '@/ui/button';

// Schema for form validation
const addBondSchema = z.object({
  name: z.string().min(1, "Bond name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  bondPrice: z.number().positive("Bond price must be positive"),
  expiryDate: z.number().positive("Expiry date must be a positive number"),
  couponIntervalMonths: z.number().min(1, "Coupon interval must be at least 1 month"),
  supplyCap: z.number().positive("Supply cap must be positive")
});

const AddBondPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(addBondSchema)
  });

  const onSubmit = async (values: any) => {
    console.log(values);
    // Here, you would typically interact with the blockchain to deploy the contract
    // with the specified parameters. After successful deployment, you might want to
    // redirect the user to another page, e.g., router.push('/dashboard');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add New Bond</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Bond Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Bond Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="symbol" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input {...field} placeholder="SYMBOL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="bondPrice" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Bond Price (ETH)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="0.05" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="expiryDate" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date (Unix Timestamp)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Unix Timestamp" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="couponIntervalMonths" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Interval (Months)</FormLabel>
              <FormControl>
                <Slider {...field} min={1} max={12} defaultValue={[6]} onValueChange={(value: any) => field.onChange(value[0])} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="supplyCap" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Supply Cap</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="1000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button className="mt-3" type="submit">Create Bond</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddBondPage;
