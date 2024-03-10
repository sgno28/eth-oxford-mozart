import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const fetchMyBonds = async (fan_address: string) => {
  console.log(`Received fan_address: '${fan_address}'`);
  console.log(typeof fan_address);
  try {
    const bondsCollectionRef = collection(
      db,
      `fans/${fan_address.trim()}/Bonds`
    );
    const q = query(bondsCollectionRef);
    const querySnapshot = await getDocs(q);
    console.log(`Documents found: ${querySnapshot.size}`);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    const bonds: { bond_address: string; number_owned: number }[] = [];
    querySnapshot.forEach((doc) => {
      console.log(`Found doc: ${doc.id} with data:`, doc.data());
      bonds.push({
        bond_address: doc.id,
        number_owned: doc.data().number_owned as number,
      });
    });

    return bonds;
  } catch (error) {
    console.error("Error fetching bonds:", error);
    throw error; // or return a meaningful error message
  }
};
