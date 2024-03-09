import { ethers } from "hardhat";

async function main() {
  const name = "RevenueShareToken";
  const symbol = "RST";
  const rate = ethers.parseUnits("1", "wei"); 
  const bondPrice = ethers.parseEther("1"); 
  const expiryDate = Math.floor(Date.now() / 1000) + 86400 * 365; 
  const couponIntervalMonths = 6; 

  
  const RevenueShareToken = await ethers.getContractFactory("RevenueShare");
  const revenueShareToken = await RevenueShareToken.deploy(name, symbol, rate, bondPrice, expiryDate, couponIntervalMonths);

  revenueShareToken.waitForDeployment;
  const address = await revenueShareToken.getAddress();
  console.log(`BondToken deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
