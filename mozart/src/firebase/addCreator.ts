import { getFirestore, doc, setDoc } from "firebase/firestore";
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
  if (!spotifyId) {
    throw new Error("Spotify ID is required to add a creator.");
  }

  // Specify the document ID explicitly by using the spotifyId
  const docRef = doc(db, "creators", spotifyId);
  console.log("adding creator:", name, web3_wallet);
  await setDoc(
    docRef,
    {
      name,
      image,
      spotifyId, // This might be redundant since spotifyId is used as the doc ID
      web3_wallet,
      // Include other fields as necessary
    },
    { merge: true }
  ); // Using { merge: true } to update existing documents instead of overwriting
};

export { app, addCreator };
