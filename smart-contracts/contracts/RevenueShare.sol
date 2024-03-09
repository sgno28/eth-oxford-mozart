// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RevenueShare is ERC20, ReentrancyGuard, Ownable {
    address public musician;
    uint256 public rate; 
    uint256 public bondPrice; 
    uint256 public expiryDate;
    uint256 public lastCouponPayment; 
    uint256 public couponInterval;

    address[] private holders;
    mapping(address => bool) private isHolder;
    mapping(address => uint256) private holderIndex;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _rate,
        uint256 _bondPrice,
        uint256 _expiryDate,
        uint256 _couponIntervalMonths
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_expiryDate > block.timestamp, "Expiry date must be in the future.");
        musician = msg.sender;
        rate = _rate;
        bondPrice = _bondPrice;
        expiryDate = _expiryDate;
        couponInterval = _couponIntervalMonths * 30 days;
        lastCouponPayment = block.timestamp;
    }

    function buyBondTokens() public payable nonReentrant {
        require(msg.value == bondPrice, "Must pay the exact bond price.");
        uint256 bondTokensToIssue = bondPrice / rate;
        _mint(msg.sender, bondTokensToIssue);
    }

    function _update(address from, address to, uint256 amount) internal override {
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