import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import { Creator } from "../lib/interfaces";

const db = getFirestore(app);

const addCreator = async ({
  spotifyId,
  name,
  start_date,
  monthly_listeners,
  followers,
  web3_wallet,
  bond,
  image,
}: Creator) => {
  await setDoc(doc(db, "creators"), {
    name,
    image,
    spotifyId,
    web3_wallet,
  });
};

export { app, addCreator };
