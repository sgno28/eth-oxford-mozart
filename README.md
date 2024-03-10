# Arya

Arya is a revolutionary blockchain platform designed to bridge the gap between artists/creators and their fans. 
By leveraging the power of blockchain technology, Arya offers a unique marketplace where fans can 'invest' in their favourite creators through a variety of means, including creator bonds, merchandise, and tickets for events. 
Built on Tezos Etherlink, Arya ensures secure and transparent transactions, making it an ideal ecosystem for artists and fans alike.

## Features

- **Creator Marketplace**: Invest in your favorite artists by purchasing bonds, which are Solidity smart contracts deployed on Tezos Etherlink. This investment reflects your support and belief in the creator's future success.
- **Merch Marketplace**: Browse and purchase exclusive merchandise directly from creators. Each item is tokenized as a smart contract, ensuring authenticity and ownership.
- **Ticket Marketplace**: Secure tickets to virtual and physical events. Like merch, tickets are also deployed as smart contracts, providing a secure and transparent way to access events.
- **Spotify Integration**: Creators use Spotify OAuth for onboarding, ensuring authenticity. Arya utilizes the Spotify Web API to extract profile details, providing fans with verified information about artists.
- **Firestore Database**: All creator details, along with the bonds linked to them, are stored securely in Firestore. This ensures that data is managed efficiently and remains accessible.

## Technology Stack

- **Blockchain**: Tezos Etherlink for deploying smart contracts for bonds, tickets, and merchandise.
- **Backend**: Firestore for database management.
- **Frontend**: Built with Next.js, offering a seamless and interactive user experience.
- **Authentication**: Spotify OAuth for creator authentication and profile details extraction.

## Quick Start

1. Clone the repository
2. Install dependencies: npm install
3. Set up environment variables
4. Start the development server: npm run dev

## Usage

After starting Arya, navigate to `http://localhost:3000` to explore the marketplace. Here's how you can start investing in creators:

- **Browse Creators**: Visit the Creator Marketplace to see available bonds.
- **Invest in Bonds**: Select a bond to view details and make a purchase.
- **Purchase Merchandise**: Visit the Merch Marketplace to buy unique items from your favourite artists.
- **Secure Event Tickets**: Check out upcoming events and secure your tickets through the Ticket Marketplace.

Enjoy :)






