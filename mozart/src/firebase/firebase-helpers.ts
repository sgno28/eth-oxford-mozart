import { getFirestore, doc, getDoc, updateDoc, collection, where, query, getDocs } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { Bond } from "@/lib/interfaces";

const db = getFirestore(app);

export async function addBondToCreator(signerAddress: string, bond: Bond) {
    const creatorsRef = collection(db, "creators");
    console.log("Adding bond to creator in Firestore:", bond);
    console.log("\nSigner address:", signerAddress)
    const creatorsQuery = query(creatorsRef, where("web3_wallet", "==", signerAddress));
    const querySnapshot = await getDocs(creatorsQuery);

    if (!querySnapshot.empty) {
        const creatorDoc = querySnapshot.docs[0];
        await updateDoc(creatorDoc.ref, {
            bond: bond
        });
        console.log("Bond added to Creator in Firestore:", bond);
    } else {
        console.error("Creator not found in Firestore");
    }
}
