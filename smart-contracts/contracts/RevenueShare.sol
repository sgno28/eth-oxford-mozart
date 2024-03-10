// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract RevenueShare is ERC20, ERC20Capped, ReentrancyGuard, Ownable {
    address public musician;
    uint256 public bondPrice;
    uint256 public expiryDate;
    uint256 public lastCouponPayment;
    uint256 public couponInterval;
    uint256 public revenueSharePercentage; // New state variable for revenue share percentage

    address[] private holders;
    mapping(address => bool) private isHolder;
    mapping(address => uint256) private holderIndex;

    event RevenueDeposited(uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _bondPrice,
        uint256 _expiryDate,
        uint256 _couponIntervalMonths,
        uint256 _supplyCap,
        uint256 _revenueSharePercentage // Constructor parameter for revenue share percentage
    ) ERC20(name, symbol) ERC20Capped(_supplyCap) Ownable(msg.sender) {
        require(_expiryDate > block.timestamp, "Expiry date must be in the future.");
        require(_revenueSharePercentage <= 100, "Revenue share percentage must be between 0 and 100.");
        musician = msg.sender;
        bondPrice = _bondPrice;
        expiryDate = _expiryDate;
        couponInterval = _couponIntervalMonths * 30 days;
        lastCouponPayment = block.timestamp;
        revenueSharePercentage = _revenueSharePercentage; // Initialize the revenue share percentage
    }

    function buyBondTokens(uint256 numberOfBonds) public payable nonReentrant {
        uint256 totalCost = bondPrice * numberOfBonds;
        require(msg.value == totalCost, "Must pay the exact price for the specified number of bonds.");

        _mint(msg.sender, numberOfBonds);
    }

    function depositRevenue() public payable nonReentrant {
        emit RevenueDeposited(msg.value);
    }

    function distributeCoupon() public onlyOwner nonReentrant {
        require(block.timestamp >= lastCouponPayment + couponInterval, "Coupon payment not due yet.");
        require(block.timestamp < expiryDate, "Cannot distribute coupons after bond expiry.");

        uint256 totalRevenue = (address(this).balance * revenueSharePercentage) / 100; // Calculate the portion of the total revenue to be distributed
        require(totalRevenue > 0, "No revenue to distribute.");

        uint256 totalSupply = totalSupply();
        require(totalSupply > 0, "No bond tokens in circulation.");

        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 holderBalance = balanceOf(holder);
            if (holderBalance > 0) {
                uint256 payout = (totalRevenue * holderBalance) / totalSupply;
                payable(holder).transfer(payout);
            }
        }

        lastCouponPayment = block.timestamp;
    }

    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        require(from == address(0), "Tokens are non-transferrable.");
        super._update(from, to, amount);

        if (amount > 0) {
            if (to != address(0) && balanceOf(to) == amount) {
                addHolder(to);
            }
        }
    }

    function addHolder(address holder) private {
        if (!isHolder[holder]) {
            holders.push(holder);
            isHolder[holder] = true;
            holderIndex[holder] = holders.length - 1;
        }
    }
}
