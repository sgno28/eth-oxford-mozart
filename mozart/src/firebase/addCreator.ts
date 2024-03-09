import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { Creator } from "../lib/interfaces";

const db = getFirestore(app);

const addCreator = async ({
  spotifyId,
  name,
  start_date,
  followers,
  web3_wallet,
  bond,
  image,
}: Creator) => {
  await addDoc(collection(db, "creators"), {
    name,
    image,
    spotifyId,
    web3_wallet,
  });
};

export { app, addCreator };