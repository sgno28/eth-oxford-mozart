# RevenueShare Contract Documentation

## Overview

The RevenueShare contract is an ERC20 token designed for musicians to issue bonds in the form of tokens, allowing investors to buy these bonds and earn revenue through periodic coupon payments. This contract features bond purchases at a fixed price, coupon distribution based on revenue deposited by the musician, and a non-transferrable token policy post-minting.

## Key Components

- **ERC20 Standard**: Inherits OpenZeppelin's ERC20 implementation, providing standard token functionalities like balance tracking and transfers (with custom restrictions).
- **ERC20Capped**: Utilizes the ERC20Capped extension to set a maximum limit on the token supply, preventing inflation and ensuring scarcity.
- **ReentrancyGuard**: Protects against reentrancy attacks during external calls, enhancing contract security.
- **Ownable**: Restricts certain functionalities (like revenue deposit and coupon distribution) to the contract owner, usually the musician or issuing entity.

## Contract Variables

- `musician (address)`: The address of the musician or the entity issuing the bonds.
- `bondPrice (uint256)`: The fixed price for purchasing a single bond token.
- `expiryDate (uint256)`: Unix timestamp indicating when the bond expires and no more coupon payments are distributed.
- `lastCouponPayment (uint256)`: Unix timestamp marking the last distribution of coupon payments.
- `couponInterval (uint256)`: The time interval in seconds between successive coupon payments.
- `holders (address[])`: An array tracking all unique token holders eligible for coupon payments.
- `isHolder (mapping)`: A mapping to quickly verify if an address is a token holder.
- `holderIndex (mapping)`: Maps each holder's address to their index in the `holders` array for efficient updates.

## Events

- `RevenueDeposited(uint256 amount)`: Emitted when the musician or owner deposits revenue into the contract for coupon distribution.

## Functions

### Constructor

Initializes the bond token with specific parameters, including the token name, symbol, bond price, expiry date, coupon interval, and supply cap.

### buyBondTokens

```solidity
function buyBondTokens(uint256 numberOfBonds) public payable nonReentrant
```

Allows investors to buy a specified number of bond tokens by sending the exact ETH amount based on the bond price. Tokens are minted to the buyer's address.

### depositRevenue

```solidity
function depositRevenue() public payable nonReentrant onlyOwner
```

Enables the musician (contract owner) to deposit revenue into the contract. The deposited amount is later used for coupon payments.

### distributeCoupon

```solidity
function distributeCoupon() public onlyOwner nonReentrant
```

Distributes the available revenue as coupon payments to all bond token holders, proportionate to their token holdings. Can only be called by the musician and within the bond's active period.

### Internal Functions

- `_update`: Overrides the ERC20 `_update` function to prevent token transfers, ensuring bonds remain with the original purchaser until expiry.
- `addHolder`: Adds a new token holder to the tracking array and mappings.
