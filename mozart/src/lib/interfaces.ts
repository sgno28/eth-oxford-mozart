export interface Creator {
  spotifyId: string | null;
  name: string | null;
  start_date: number | null;
  followers: number | null;
  web3_wallet: string | null;
  bond: Bond | null;
  image: string | null;
  ticketCollections: TicketCollection[];
  merchandise?: Merchandise;
}

export interface Merchandise {
  contract_address: string;
  merchItems: MerchItem[];
}

export interface SpotifyProfile {
  displayName: string | null;
  spotifyId: string | null;
  image: string | null;
}

export interface Fan {
  id: string;
  bonds_purchased: BondDetails[];
}

export interface BondDetails {
  bond_name: string;
  bond_address: string;
  number_of_tokens: number;
  revenue_share: number;
  principal_fee: number;
  supplyCap: number;
}

export interface Bond {
  contract_address: string;
  creator: string;
  principal_fee: number;
  revenue_share: number;
  expiry_date: number;
  coupon_interval: number;
  supplyCap: number;
}

export interface TicketCollection {
  owner: string;
  address: string;
  commonIpfsUrl: string;
  ticketPrice: string;
}

export interface MerchItem {
  name: string;
  price: string;
  supplyCap: number;
  sold?: number;
  isActive?: boolean;
}
