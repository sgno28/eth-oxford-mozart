import { Bond } from "@/lib/interfaces";
import Link from "next/link";
import { Separator } from "@/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";

export default function MyCreators() {
  return (
    <div className="px-5 py-2">
      <h2 className="text-2xl font-semibold tracking-tight">
        Creator Bonds Purchased
      </h2>
      <p>View all of your currently purchased bonds</p>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummy_bonds_purchased.map((bond, index) => (
          <BondCard key={index} bond={bond} />
        ))}
      </div>
    </div>
  );
}

function BondCard({ bond }: { bond: Bond }) {
  return (
    <Link href={`/fan/bond/${bond.contract_address}`}>
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {bond.contract_address}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Price: {bond.principal_fee} ETH</CardDescription>
          <CardDescription>Supply Cap: {bond.supplyCap}</CardDescription>
          <CardDescription>
            Revenue Share: {bond.revenue_share}%
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

const dummy_bond_purchased: Bond = {
  contract_address: "0x1",
  creator: "0x2",
  principal_fee: 50,
  revenue_share: 0.01,
  expiry_date: 1712711617,
  coupon_interval: 5,
  supplyCap: 50,
};

const dummy_bonds_purchased: Bond[] = [
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
  dummy_bond_purchased,
];
