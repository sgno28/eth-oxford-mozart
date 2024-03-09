// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RevenueShare.sol";

contract MerchandiseSale is ReentrancyGuard, Ownable {
    struct MerchItem {
        string name;
        uint256 price;
        uint256 supplyCap;
        uint256 sold;
        bool isActive;
    }

    mapping(uint256 => MerchItem) public merchCatalog;
    uint256 public nextItemId = 1;  // Start itemId from 1
    address public revenueShareAddress;

    event MerchandiseSold(address buyer, uint256 itemId, uint256 price);

    constructor(address _revenueShareAddress) Ownable(msg.sender) {
        require(_revenueShareAddress != address(0), "RevenueShare address cannot be zero.");
        revenueShareAddress = _revenueShareAddress;
    }

    function addItem(string memory name, uint256 price, uint256 supplyCap) public onlyOwner {
        require(supplyCap > 0, "Supply cap must be greater than zero.");
        merchCatalog[nextItemId] = MerchItem(name, price, supplyCap, 0, true);
        nextItemId++;  // Increment the itemId for the next item
    }

    function purchaseItem(uint256 itemId) public payable nonReentrant {
        require(merchCatalog[itemId].isActive, "Item does not exist.");
        require(msg.value == merchCatalog[itemId].price, "Incorrect payment amount.");
        require(merchCatalog[itemId].sold < merchCatalog[itemId].supplyCap, "Item sold out.");

        merchCatalog[itemId].sold++;
        RevenueShare(revenueShareAddress).depositRevenue{value: msg.value}();

        emit MerchandiseSold(msg.sender, itemId, msg.value);
    }

    function setRevenueShareAddress(address _revenueShareAddress) public onlyOwner {
        require(_revenueShareAddress != address(0), "RevenueShare address cannot be zero.");
        revenueShareAddress = _revenueShareAddress;
    }
}
