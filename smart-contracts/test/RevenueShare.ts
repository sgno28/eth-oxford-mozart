import { ethers } from "hardhat";
import { expect } from "chai";
import { RevenueShare } from "../typechain-types/contracts/RevenueShare";

describe("RevenueShare Contract", function () {
  let revenueShare: RevenueShare;
  let owner: any, user1: any, user2: any;
  const bondPrice = ethers.parseEther("1"); // 1 ETH
  const rate = ethers.parseEther("1"); // 1 Token per 1 ETH
  const supplyCap = ethers.parseEther("1000"); // Cap at 1000 Tokens
  const couponIntervalMonths = 6; // Coupon payment every 6 months

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const futureExpiryDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // Set expiry date to 1 year from now

    const RevenueShareFactory = await ethers.getContractFactory("RevenueShare");
    revenueShare = (await RevenueShareFactory.deploy(
      "RevenueShareToken",
      "RST",
      bondPrice,
      futureExpiryDate,
      couponIntervalMonths,
      supplyCap
    )) as RevenueShare;

    revenueShare.waitForDeployment;
  });

  it("Should allow users to buy bond tokens", async function () {
    const buyTx1 = await revenueShare.connect(user1).buyBondTokens(1, { value: bondPrice });
    await buyTx1.wait();

    const balanceUser1 = await revenueShare.balanceOf(user1.address);
    expect(balanceUser1).to.equal(bondPrice / rate);
  });

  it("Should distribute coupon payments correctly", async function () {
    await revenueShare.connect(user1).buyBondTokens(1, { value: bondPrice });
    await revenueShare.connect(user2).buyBondTokens(1, { value: bondPrice });

    // Simulate passage of time for the coupon interval
    await ethers.provider.send("evm_increaseTime", [couponIntervalMonths * 30 * 24 * 3600]); // Approx. 6 months in seconds
    await ethers.provider.send("evm_mine", []);

    const contractInitialBalance = bondPrice * ethers.toBigInt(2); // Both users bought tokens
    await revenueShare.connect(owner).depositRevenue({ value: contractInitialBalance });

    const distributeTx = await revenueShare.connect(owner).distributeCoupon();
    await distributeTx.wait();

    // Users should have received coupon payments, thus having more ETH than the initial bond price
    const user1FinalBalance = await ethers.provider.getBalance(user1.address);
    const user2FinalBalance = await ethers.provider.getBalance(user2.address);

    expect(user1FinalBalance).to.be.gt(bondPrice);
    expect(user2FinalBalance).to.be.gt(bondPrice);
  });

  it("Should prevent transferring tokens", async function () {
    await revenueShare.connect(user1).buyBondTokens(1, { value: bondPrice });

    await expect(
      revenueShare.connect(user1).transfer(user2.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Tokens are non-transferrable.");
  });
});
