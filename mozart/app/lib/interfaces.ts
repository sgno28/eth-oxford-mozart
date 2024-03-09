export interface CreatorBond {
  id: string;
  principal_fee: number;
  revenue_share: number;
  expiry_date: number;
  coupon_interval: number;
  investors: string[];
}

export interface Creator {
  id: string;
  name: string;
  start_date: number;
  monthly_listeners: number;
  followers: number;
  web3_wallet: string;
  bond: CreatorBond;
}

export interface Fan {
  id: string;
  wallet: string;
  name: string;
  bonds_purchased: CreatorBond[];
}
