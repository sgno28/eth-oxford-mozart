"use client";
import { ethers } from "ethers";
import React, { useState } from "react";
import { revenueShareContract } from "@/contracts/revenueShare";
import { Button } from "@/ui/button";
import { useRouter } from 'next/navigation'

const abi = revenueShareContract.abi;
const bytecode = revenueShareContract.bytecode;

export default function Web3Component() {
    const router = useRouter()
    const [deployedContractAddress, setDeployedContractAddress] = useState("");

    async function deployContract() {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
        const contract = await contractFactory.deploy(
            "RevenueShareToken",
            "RST",
            ethers.utils.parseEther("0.05"),
            Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
            6,
            ethers.utils.parseEther("1000")
        );
        await contract.deployed();

        setDeployedContractAddress(contract.address);
        console.log("Contract deployed at:", contract.address);
        router.push(`/web3/user/${contract.address}`);
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Button onClick={deployContract}>Deploy Contract</Button>
            {deployedContractAddress && <p>Deployed Contract Address: {deployedContractAddress}</p>}
        </div>
    );
}
