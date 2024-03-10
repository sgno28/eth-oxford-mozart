import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "./firebaseConfig";
import { BondDetails, Fan } from "@/lib/interfaces";

const db = getFirestore(app);

const addPurchasedBond = async (
  fan_address: string,
  name: string,
  bond_address: string,
  amountPurchased: number,
  revenue_share: number,
  principal_fee: number,
  supplyCap: number,
) => {
  const bondDocRef = doc(db, 'fans', fan_address);

  const bondType: BondDetails = {
    bond_name: name,
    bond_address: bond_address,
    number_of_tokens: amountPurchased,
    revenue_share: revenue_share,
    principal_fee: principal_fee,
    supplyCap: supplyCap,
  }

  // Check if the bond document exists
  const bondDocSnap = await getDoc(bondDocRef);

  if (bondDocSnap.exists()) {
    // If the document exists, increment the number_owned
    await updateDoc(bondDocRef, {
      bonds_purchased: [bondType],
    });
  } else {
    // If the document does not exist, create it
    await setDoc(bondDocRef, {
      bonds_purchased: [bondType],
    });
  }
};

export { app, addPurchasedBond };
