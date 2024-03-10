import { getFirestore, doc, collection, where, query, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { Bond } from "@/lib/interfaces";
import { TicketCollection, Merchandise } from "@/lib/interfaces";

const db = getFirestore(app);

export async function checkMerchandiseStore(signerAddress: string) {
  const creatorsRef = collection(db, "creators");
  const q = query(creatorsRef, where("web3_wallet", "==", signerAddress));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const merchandiseStore = querySnapshot.docs[0].data().merchandiseStore;
    const exists = !!merchandiseStore;
    return exists;
  } else {
    console.error("Creator not found in Firestore");
    return null;
  }
}

export async function addMerchandiseStoreToCreator(creatorAddress: string, merchandise: Merchandise) {
    const creatorsRef = collection(db, "creators");
    const creatorsQuery = query(creatorsRef, where("web3_wallet", "==", creatorAddress));
    const querySnapshot = await getDocs(creatorsQuery);

    if (!querySnapshot.empty) {
        const creatorDoc = querySnapshot.docs[0];
        await updateDoc(creatorDoc.ref, {
            merchandise: merchandise
        });
    }
}

export async function addTicketCollectionToCreator(signerAddress: string, ticketCollection: TicketCollection) {
    const creatorsRef = collection(db, "creators");
    const creatorsQuery = query(creatorsRef, where("web3_wallet", "==", signerAddress));
    const querySnapshot = await getDocs(creatorsQuery);

    if (!querySnapshot.empty) {
        const creatorDoc = querySnapshot.docs[0];
        await updateDoc(creatorDoc.ref, {
            ticketCollections: arrayUnion(ticketCollection)
        });
    } else {
        console.error("Creator not found in Firestore");
    }
}

export async function getTicketCollectionsByCreator(walletAddress: string) {
    const creatorsRef = collection(db, "creators");
    const q = query(creatorsRef, where("web3_wallet", "==", walletAddress));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return docData.ticketCollections as TicketCollection[];
    } else {
      console.error("Creator not found in Firestore");
      return [];
    }
  }

export async function getCreatorRevenueShareAddress(web3WalletAddress: string) {
    // Reference to the creators collection
    const creatorsRef = collection(db, "creators");
    const creatorsQuery = query(creatorsRef, where("web3_wallet", "==", web3WalletAddress));
    const querySnapshot = await getDocs(creatorsQuery);
    
    if (!querySnapshot.empty) {
        const creatorDoc = querySnapshot.docs[0];
        return creatorDoc.data().bond.contract_address;
    } else {
        console.error("Creator not found in Firestore");
    }

}

export async function getBondByContractAddress(contractAddress: string) {
    const creatorsRef = collection(db, "creators");
    const bondQuery = query(creatorsRef, where("bond.contract_address", "==", contractAddress));
    const querySnapshot = await getDocs(bondQuery);
    
    if (!querySnapshot.empty) {
        const creatorDoc = querySnapshot.docs[0];
        return creatorDoc.data().bond;
    } else {
        console.error("Bond not found in Firestore");
    }
}

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
