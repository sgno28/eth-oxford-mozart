import { ethers } from "hardhat";
import { expect } from "chai";
import { MerchandiseSale } from "../typechain-types/contracts/MerchandiseSale";
import { RevenueShare } from "../typechain-types/contracts/RevenueShare";

describe("MerchandiseSale Contract", function () {
  let merchandiseSale: MerchandiseSale;
  let revenueShare: RevenueShare;
  let owner: any, user1: any, user2: any;
  const itemPrice = ethers.parseEther("0.05"); // 0.05 ETH per item
  const supplyCap = 100; // Cap at 100 items for each merchandise item

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy RevenueShare contract first
    const RevenueShareFactory = await ethers.getContractFactory("RevenueShare");
    revenueShare = (await RevenueShareFactory.deploy(
      "RevenueShareToken",
      "RST",
      itemPrice,
      Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // Set expiry date to 1 year from now
      6, // Coupon payment every 6 months
      ethers.parseEther("1000"),
      10
    )) as RevenueShare;

    // Deploy MerchandiseSale with the address of the RevenueShare contract
    const MerchandiseSaleFactory = await ethers.getContractFactory("MerchandiseSale");
    const revenueShareAddress = revenueShare.getAddress();
    merchandiseSale = (await MerchandiseSaleFactory.deploy(revenueShareAddress)) as MerchandiseSale;
  });

  it("Should allow owner to add new merchandise items", async function () {
    await merchandiseSale.connect(owner).addItem("T-Shirt", itemPrice, supplyCap);
    const item = await merchandiseSale.merchCatalog(1);

    expect(item.name).to.equal("T-Shirt");
    expect(item.price).to.equal(itemPrice);
    expect(item.supplyCap).to.equal(supplyCap);
    expect(item.sold).to.equal(0);
    expect(item.isActive).to.be.true;
  });

  it("Should allow users to purchase merchandise items", async function () {
    await merchandiseSale.connect(owner).addItem("T-Shirt", itemPrice, supplyCap);
    const revenueShareAddress = await revenueShare.getAddress();
    const initialRevenueShareBalance = await ethers.provider.getBalance(revenueShareAddress);

    await expect(merchandiseSale.connect(user1).purchaseItem(1, { value: itemPrice }))
      .to.emit(merchandiseSale, 'MerchandiseSold')
      .withArgs(user1.address, 1, itemPrice);

    const item = await merchandiseSale.merchCatalog(1);
    expect(item.sold).to.equal(1);

    const finalRevenueShareBalance = await ethers.provider.getBalance(revenueShareAddress);
    expect(finalRevenueShareBalance - initialRevenueShareBalance).to.equal(itemPrice);
  });

  it("Should enforce supply cap on merchandise items", async function () {
    await merchandiseSale.connect(owner).addItem("T-Shirt", itemPrice, 1); // Supply cap of 1

    await merchandiseSale.connect(user1).purchaseItem(1, { value: itemPrice });

    await expect(merchandiseSale.connect(user2).purchaseItem(1, { value: itemPrice }))
      .to.be.revertedWith("Item sold out.");
  });
});
