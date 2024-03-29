import { getFirestore, collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { BondDetails, Fan } from "@/lib/interfaces";

const db = getFirestore(app);

export const fetchMyBonds = async (fan_address: string) => {
  try {
    console.log("Fetching bonds for fan:", fan_address);
    const fanDocRef = doc(db, "fans", fan_address);
    console.log("fanDocRef:", fanDocRef);
    const docSnapshot = await getDoc(fanDocRef);

    if (!docSnapshot.exists()) {
      console.log("No matching document found for the given fan address.");
      return [];
    }

    const fanData = docSnapshot.data() as Fan; // Cast the document data to the Fan type
    const bonds: BondDetails[] = [];

    // Iterate over each bond in the bonds_purchased array and push it to the bonds array
    fanData.bonds_purchased.forEach((bond) => {
      bonds.push({
        bond_name: bond.bond_name,
        bond_address: bond.bond_address,
        number_of_tokens: bond.number_of_tokens,
        revenue_share: bond.revenue_share,
        principal_fee: bond.principal_fee,
        supplyCap: bond.supplyCap,
      });
    });

    return bonds;
  } catch (error) {
    console.error("Error fetching bonds for fan:", error);
    throw error; // or return a meaningful error message
  }
};