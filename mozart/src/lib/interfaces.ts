export interface CreatorBond {
  id: string;
  principal_fee: number;
  revenue_share: number;
  expiry_date: number;
  coupon_interval: number;
  investors: string[];
}

export interface Creator {
  spotifyId: string | null;
  name: string | null;
  start_date: number | null;
  followers: number | null;
  web3_wallet: string | null;
  bond: CreatorBond | null;
  image: string | null;
}

export interface SpotifyProfile {
  displayName: string | null;
  spotifyId: string | null;
  image: string | null;
}

export interface Fan {
  id: string;
  wallet: string;
  name: string;
  bonds_purchased: CreatorBond[];
}
