// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RevenueShare.sol"; 

contract TicketFactory is ERC721, ReentrancyGuard, Ownable {
    uint256 private _nextTokenId;
    address public revenueShareAddress; // Address of the RevenueShare contract associated with the musician
    string private _commonIpfsUrl; // Common IPFS URL for all tokens

    constructor(address initialOwner, address _revenueShareAddress, string memory commonIpfsUrl)
        ERC721("Ticket", "TKT")
        Ownable(initialOwner)
    {
        revenueShareAddress = _revenueShareAddress;
        _commonIpfsUrl = commonIpfsUrl;
    }

    function safeMint(address to, uint256 ticketPrice) public payable nonReentrant onlyOwner {
        require(msg.value == ticketPrice, "Incorrect payment amount");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Forward the received funds to the RevenueShare contract
        (bool success, ) = revenueShareAddress.call{value: msg.value}("");
        require(success, "Failed to forward funds to RevenueShare contract");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _commonIpfsUrl;
    }

    function setCommonIpfsUrl(string memory commonIpfsUrl) public onlyOwner {
        _commonIpfsUrl = commonIpfsUrl;
    }

    function setRevenueShareAddress(address _revenueShareAddress) public onlyOwner {
        revenueShareAddress = _revenueShareAddress;
    }
}
