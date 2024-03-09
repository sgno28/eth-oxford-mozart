import { ethers } from "hardhat";
import { expect } from "chai";
import { TicketFactory } from "../typechain-types/contracts/Ticket.sol/TicketFactory";
import { RevenueShare } from "../typechain-types/contracts/RevenueShare";

describe("TicketFactory Contract", function () {
  let ticketFactory: TicketFactory;
  let revenueShare: RevenueShare;
  let owner: any, user1: any, user2: any;
  const ticketPrice = ethers.parseEther("0.1"); // 0.1 ETH per ticket
  const commonIpfsUrl = "ipfs://exampleCommonIpfsUrl";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy RevenueShare contract first
    const RevenueShareFactory = await ethers.getContractFactory("RevenueShare");
    revenueShare = (await RevenueShareFactory.deploy(
      "RevenueShareToken",
      "RST",
      ticketPrice,
      Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // Set expiry date to 1 year from now
      6, // Coupon payment every 6 months
      ethers.parseEther("1000") // Cap at 1000 Tokens,
    )) as RevenueShare;

    // Deploy TicketFactory with the address of the RevenueShare contract
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const revenueShareAddress = await revenueShare.getAddress();
    ticketFactory = (await TicketFactory.deploy(owner.address, revenueShareAddress, commonIpfsUrl)) as TicketFactory;
  });

  it("Should mint tickets and forward funds to RevenueShare", async function () {
    const revenueShareAddress = await revenueShare.getAddress();
    const initialRevenueShareBalance = await ethers.provider.getBalance(revenueShareAddress);

    await expect(ticketFactory.connect(owner).safeMint(user1.address, ticketPrice, { value: ticketPrice }))
      .to.emit(ticketFactory, 'Transfer')
      .withArgs(ethers.ZeroAddress, user1.address, 0);

    const finalRevenueShareBalance = await ethers.provider.getBalance(revenueShareAddress);
    expect(finalRevenueShareBalance).to.equal(initialRevenueShareBalance + ticketPrice);
  });

  it("Should return the correct tokenURI", async function () {
    await ticketFactory.connect(owner).safeMint(user1.address, ticketPrice, { value: ticketPrice });
    const tokenURI = await ticketFactory.tokenURI(0);
    expect(tokenURI).to.equal(commonIpfsUrl);
  });

  it("Should only allow owner to mint tickets", async function () {
    await expect(ticketFactory.connect(user1).safeMint(user2.address, ticketPrice, { value: ticketPrice }))
      .to.be.reverted;
  });

  it("Should only allow owner to set common IPFS URL", async function () {
    const newIpfsUrl = "ipfs://newCommonIpfsUrl";
    await expect(ticketFactory.connect(user1).setCommonIpfsUrl(newIpfsUrl))
      .to.be.reverted;
    
    await ticketFactory.connect(owner).setCommonIpfsUrl(newIpfsUrl);
    await ticketFactory.connect(owner).safeMint(user1.address, ticketPrice, { value: ticketPrice });
    const tokenURI = await ticketFactory.tokenURI(0);
    expect(tokenURI).to.equal(newIpfsUrl);
  });
});
