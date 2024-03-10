"use client";

import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../firebase/firebaseConfig";

interface Creator {
  name: string;
  image: string;
}

const db = getFirestore(app);

const FanPageDiscover = () => {
  const [trendingCreators, setTrendingCreators] = useState<Creator[]>([]);
  
  useEffect(() => {
    const fetchTrendingCreators = async () => {
      const querySnapshot = await getDocs(collection(db, "creators"));
      const creators: Creator[] = [];
    
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name && data.image) {
          creators.push({
            name: data.name,
            image: data.image,
          });
        }
      });
    
      setTrendingCreators(creators);
    };

    fetchTrendingCreators();
  }, []);

  return (
    <div>
      {trendingCreators.map((creator, index) => (
        <div key={index}>
          <h2>{creator.name}</h2>
          <img src={creator.image} alt={`Profile of ${creator.name}`} />
        </div>
      ))}
    </div>
  );
}

export default FanPageDiscover;
