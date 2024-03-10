//NEED TO EDIT THIS AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHH
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { app } from "./firebaseConfig";
  
  const db = getFirestore(app);
  
  const addPurchasedMerch = async (
    fan_address: string,
    bond_address: string,
    amountPurchased: number
  ) => {
    const bondDocRef = doc(db, `fans/${fan_address}/Bonds`, bond_address);
  
    // Check if the bond document exists
    const bondDocSnap = await getDoc(bondDocRef);
  
    if (bondDocSnap.exists()) {
      // If the document exists, increment the number_owned
      await updateDoc(bondDocRef, {
        number_owned: bondDocSnap.data().number_owned + amountPurchased, // Adjust the increment logic as needed
      });
    } else {
      // If the document doesn't exist, create it with initial number_owned
      await setDoc(bondDocRef, { number_owned: amountPurchased }); // Adjust the initial value as needed
    }
  };
  
  export { app, addPurchasedMerch };
  