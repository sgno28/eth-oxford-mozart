// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RevenueShare.sol";


contract MerchandiseSale is ReentrancyGuard, Ownable {
    // Struct to represent merchandise item
    struct MerchItem {
        string name;
        uint256 price;
        uint256 supplyCap; // The maximum amount of this item that can be sold
        uint256 sold; // The number of items sold
        bool isActive;
    }

    // Map item IDs to merchandise items
    mapping(uint256 => MerchItem) public merchCatalog;

    // Address of the RevenueShare contract associated with the musician
    address public revenueShareAddress;

    // Event for merchandise sales
    event MerchandiseSold(address buyer, uint256 itemId, uint256 price);

    constructor(address _revenueShareAddress) Ownable(msg.sender) {
        require(_revenueShareAddress != address(0), "RevenueShare address cannot be zero.");
        revenueShareAddress = _revenueShareAddress;
    }


    function addItem(uint256 itemId, string memory name, uint256 price, uint256 supplyCap) public onlyOwner {
        require(!merchCatalog[itemId].isActive, "Item already exists.");
        require(supplyCap > 0, "Supply cap must be greater than zero.");
        merchCatalog[itemId] = MerchItem(name, price, supplyCap, 0, true);
    }

    function purchaseItem(uint256 itemId) public payable nonReentrant {
        require(merchCatalog[itemId].isActive, "Item does not exist.");
        require(msg.value == merchCatalog[itemId].price, "Incorrect payment amount.");
        require(merchCatalog[itemId].sold < merchCatalog[itemId].supplyCap, "Item sold out.");

        // Increment the sold counter
        merchCatalog[itemId].sold++;

        // Forward the received funds to the RevenueShare contract
        RevenueShare(revenueShareAddress).depositRevenue{value: msg.value}();

        emit MerchandiseSold(msg.sender, itemId, msg.value);
    }

    function setRevenueShareAddress(address _revenueShareAddress) public onlyOwner {
        require(_revenueShareAddress != address(0), "RevenueShare address cannot be zero.");
        revenueShareAddress = _revenueShareAddress;
    }
}
