"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { usePathname } from "next/navigation";
import { revenueShareContract } from "@/contracts/revenueShare";
import { merchandiseSaleContract } from "@/contracts/merchandiseSale";
import { Button } from "@/ui/button"; 
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";

export default function UserPage() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const revenueShareAddress = pathSegments[pathSegments.length - 1];
    const [revenueShareContractInstance, setRevenueShareContractInstance] = useState<ethers.Contract | null>(null);
    const [merchandiseContractAddress, setMerchandiseContractAddress] = useState("");
    const [newItem, setNewItem] = useState({ name: '', price: 0, supplyCap: 0 });

    const merchandiseSaleContractABI = merchandiseSaleContract.abi;
    const merchandiseSaleBytecode = merchandiseSaleContract.bytecode;

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
        const contract = new ethers.Contract(revenueShareAddress, revenueShareContract.abi, signer);
        setRevenueShareContractInstance(contract);
    }, [revenueShareAddress]);

    async function deployMerchandiseContract() {
        if (!revenueShareContractInstance) {
            console.error("Deploy Revenue Share contract first.");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const merchandiseContractFactory = new ethers.ContractFactory(merchandiseSaleContractABI, merchandiseSaleBytecode, signer);
        const merchandiseContract = await merchandiseContractFactory.deploy(revenueShareContractInstance.address);
        await merchandiseContract.deployed();
        setMerchandiseContractAddress(merchandiseContract.address);
    }

    function handleNewItemChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewItem({ ...newItem, [event.target.name]: event.target.value });
    }

    async function addMerchandiseItem() {
        if (!merchandiseContractAddress) {
            console.error("Deploy Merchandise Contract first.");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const merchandiseContract = new ethers.Contract(merchandiseContractAddress, merchandiseSaleContractABI, signer);
        await merchandiseContract.addItem(1, newItem.name, ethers.utils.parseEther(newItem.price.toString()), newItem.supplyCap);
    }

    async function purchaseItem(itemId: number) {
        try {
            if (!merchandiseContractAddress) {
                throw new Error("No Merchandise Contract deployed.");
            }
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const merchandiseContract = new ethers.Contract(merchandiseContractAddress, merchandiseSaleContractABI, signer);
    
            console.log(`Purchasing item with ID: ${itemId}`);
            await merchandiseContract.purchaseItem(itemId, { value: ethers.utils.parseEther("1") }); // Ensure this value matches the item price
        } catch (error) {
            console.error("Purchase Item Error:", error);
        }
    }
    

    async function checkRevenueShareBalance() {
        if (!revenueShareContractInstance) {
            console.error("No Revenue Share Contract deployed.");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const balance = await provider.getBalance(revenueShareContractInstance.address);
        console.log("Revenue Share Contract Balance:", ethers.utils.formatEther(balance));
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Button onClick={deployMerchandiseContract}>Deploy Merchandise Contract</Button>
            <div>
                <Label>Name:</Label>
                <Input name="name" value={newItem.name} onChange={handleNewItemChange} />
                <Label>Price:</Label>
                <Input name="price" value={newItem.price} type="number" onChange={handleNewItemChange} />
                <Label>Supply Cap:</Label>
                <Input name="supplyCap" value={newItem.supplyCap} type="number" onChange={handleNewItemChange} />
                <Button onClick={addMerchandiseItem}>Add Merchandise Item</Button>
            </div>
            <Button onClick={() => purchaseItem(1)}>Purchase Item</Button> 
            <Button onClick={checkRevenueShareBalance}>Check Revenue Share Balance</Button>
        </div>
    );
}
