// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RevenueShare.sol"; // Assuming RevenueShare contract is in the same directory

/**
 * @title TicketFactory
 * @dev Contract for minting NFT tickets with a common IPFS URL for all tokens, where sale proceeds are routed to the musician's bond contract.
 */
contract TicketFactory is ERC721, ReentrancyGuard, Ownable {
    uint256 private _nextTokenId;
    address public revenueShareAddress; // Address of the RevenueShare contract associated with the musician
    string private _commonIpfsUrl; // Common IPFS URL for all tokens

    constructor(address initialOwner, address _revenueShareAddress, string memory commonIpfsUrl)
        ERC721("TicketFactory", "TCKT")
        Ownable(initialOwner)
    {
        revenueShareAddress = _revenueShareAddress;
        _commonIpfsUrl = commonIpfsUrl;
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
     * @dev Override tokenURI to return the common IPFS URL for all token IDs.
     * @param tokenId The ID of the token.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _commonIpfsUrl;
    }

    /**
     * @dev Set or update the common IPFS URL for all tokens.
     * @param commonIpfsUrl The new common IPFS URL.
     */
    function setCommonIpfsUrl(string memory commonIpfsUrl) public onlyOwner {
        _commonIpfsUrl = commonIpfsUrl;
    }

    /**
     * @dev Set the RevenueShare contract address.
     * @param _revenueShareAddress Address of the RevenueShare contract.
     */
    function setRevenueShareAddress(address _revenueShareAddress) public onlyOwner {
        revenueShareAddress = _revenueShareAddress;
    }
}
