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
    uint256 public ticketPrice; // Ticket price added as a state variable

    constructor(
        address initialOwner, 
        address _revenueShareAddress, 
        string memory commonIpfsUrl,
        uint256 _ticketPrice // Added ticketPrice as a constructor argument
    )
        ERC721("Ticket", "TKT")
        Ownable(initialOwner)
    {
        revenueShareAddress = _revenueShareAddress;
        _commonIpfsUrl = commonIpfsUrl;
        ticketPrice = _ticketPrice; // Initialize ticketPrice state variable
    }

    function safeMint(address to) public payable nonReentrant onlyOwner {
        require(msg.value == ticketPrice, "Incorrect payment amount");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        RevenueShare revenueShareContract = RevenueShare(revenueShareAddress);

        // Forward the received funds to the RevenueShare contract
        (bool success, ) = address(revenueShareContract).call{value: msg.value}(
            abi.encodeWithSignature("depositRevenue()")
        );
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
