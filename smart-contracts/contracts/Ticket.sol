// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RevenueShare.sol";

/**
 * @title TicketFactory
 * @dev Contract for minting NFT tickets where sale proceeds are routed to the musician's bond contract.
 */
contract TicketFactory is ERC721, ReentrancyGuard, Ownable {
    uint256 private _nextTokenId;
    address public revenueShareAddress; // Address of the RevenueShare contract associated with the musician

    constructor(address initialOwner, address _revenueShareAddress)
        ERC721("TicketFactory", "TCKT")
        Ownable(initialOwner)
    {
        revenueShareAddress = _revenueShareAddress;
    }

    /**
     * @dev Mint a new ticket NFT and sends sale funds to the RevenueShare contract.
     * @param to Recipient of the minted ticket.
     * @param ticketPrice Price of the ticket being sold.
     */
    function safeMint(address to, uint256 ticketPrice) public payable nonReentrant onlyOwner {
        require(msg.value == ticketPrice, "Incorrect payment amount");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Forward the received funds to the RevenueShare contract
        (bool success, ) = revenueShareAddress.call{value: msg.value}("");
        require(success, "Failed to forward funds to RevenueShare contract");
    }

    /**
     * @dev Override _baseURI to set the base URI for all token IDs.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://example.com/api/token/";
    }

    /**
     * @dev Set the RevenueShare contract address.
     * @param _revenueShareAddress Address of the RevenueShare contract.
     */
    function setRevenueShareAddress(address _revenueShareAddress) public onlyOwner {
        revenueShareAddress = _revenueShareAddress;
    }
}
