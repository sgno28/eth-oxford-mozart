"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { merchandiseSaleContract } from "@/contracts/merchandiseSale";
import { Button } from "@/ui/button"; 
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface MerchItem {
  id: number;
  name: string;
  price: ethers.BigNumber;
  supplyCap: number;
  sold: number;
  isActive: boolean;
}

export default function UserPage() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const revenueShareAddress = pathSegments[pathSegments.length - 1];
    const [merchandiseContract, setMerchandiseContract] = useState<ethers.Contract | null>(null);
    const [items, setItems] = useState<MerchItem[]>([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', supplyCap: '' });

    useEffect(() => {
        if (!revenueShareAddress) {
            console.log("No Revenue Share contract address found.");
            return;
        }
        if (!(window as any).ethereum) {
            console.log("Ethereum provider not available.");
            return;
        }

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(revenueShareAddress, merchandiseSaleContract.abi, signer);
        setMerchandiseContract(contractInstance);
        loadItems(contractInstance);
    }, [revenueShareAddress]);

    const loadItems = async (contractInstance: ethers.Contract) => {
        const totalItems = await contractInstance.nextItemId;
        const itemsArray = [];

        for (let i = 1; i < totalItems.toNumber(); i++) {
            const item = await contractInstance.merchCatalog(i);
            if (item.isActive) {
                itemsArray.push({
                    id: i,
                    name: item.name,
                    price: item.price,
                    supplyCap: item.supplyCap.toNumber(),
                    sold: item.sold.toNumber(),
                    isActive: item.isActive,
                });
            }
        }

        setItems(itemsArray);
    };

    const handleNewItemChange = (e: any) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddItem = async () => {
        if (!merchandiseContract) {
            console.error("Merchandise Contract not loaded.");
            return;
        }
        await merchandiseContract.addItem(
            newItem.name, 
            parseInt(newItem.price), 
            parseInt(newItem.supplyCap)
        );
        // Reload items after adding
        await loadItems(merchandiseContract);
    };

    const handlePurchaseItem = async (itemId: number, price: string) => {
        if (!merchandiseContract) {
            console.error("No Merchandise Contract deployed.");
            return;
        }
        await merchandiseContract.purchaseItem(itemId, { value: ethers.utils.parseEther(price.toString()) });
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <h1>Merchandise Items</h1>
            <div className="space-y-2">
                <Label>Name:</Label>
                <Input name="name" value={newItem.name} onChange={handleNewItemChange} />
                <Label>Price (ETH):</Label>
                <Input name="price" value={newItem.price} onChange={handleNewItemChange} />
                <Label>Supply Cap:</Label>
                <Input name="supplyCap" value={newItem.supplyCap} onChange={handleNewItemChange} />
                <Button onClick={handleAddItem}>Add Merchandise Item</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="border p-4">
                        <p>Name: {item.name}</p>
                        <p>Price: {ethers.utils.formatEther(item.price)} ETH</p>
                        <p>Supply Cap: {item.supplyCap}</p>
                        <p>Sold: {item.sold}</p>
                        <Button onClick={() => handlePurchaseItem(item.id, ethers.utils.formatEther(item.price))}>Purchase</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
