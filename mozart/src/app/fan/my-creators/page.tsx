import { Bond } from "@/lib/interfaces";
import { ScrollArea, ScrollBar } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";

export default function MyCreators() {
  return (
    <>
      <div className="px-5 py-2 ">
        <h2 className="text-2xl font-semibold tracking-tight">
          Creator Bonds Purchased
        </h2>
        <p>View all of your currently purchased bonds</p>
        <Separator className="my-4" />
      </div>
    </>
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
