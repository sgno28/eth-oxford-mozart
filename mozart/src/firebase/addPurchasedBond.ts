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
  bond_address: string,
  amountPurchased: number
) => {
  const bondDocRef = doc(db, 'fans', fan_address);

  const bondType: BondDetails = {
    bond_address: bond_address,
    number_of_tokens: amountPurchased,
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
