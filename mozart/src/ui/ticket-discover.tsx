import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Merchandise, TicketCollection } from "@/lib/interfaces";
import { Card, CardTitle, CardContent } from "@/ui/card";

const db = getFirestore(app);

export default function TicketDiscover() {
  const [tickets, setTickets] = useState<TicketCollection[]>([]);
  const [merch, setMerch] = useState<Merchandise[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "creators"));
        
        const fetchedTickets: TicketCollection[] = [];
        const fetchedMerch: Merchandise[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Assuming ticketCollections is an array of TicketCollection
          if (data.ticketCollections) {
            fetchedTickets.push(...data.ticketCollections.map(tc => ({
              owner: tc.owner || null,
              address: tc.address || null,
              commonIpfsUrl: tc.commonIpfsUrl,
              ticketPrice: tc.ticketPrice,
            })));
          }
          
          // Assuming merchItems is part of the merchandise object
          if (data.merchandise && data.merchandise.merchItems) {
            fetchedMerch.push({
              contract_address: data.contract_address || null,
              merchItems: data.merchandise.merchItems,
            });
          }
        });

        setTickets(fetchedTickets);
        setMerch(fetchedMerch);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="px-5 py-2">
        <h2 className="text-2xl font-semibold tracking-tight">Tickets</h2>
        <div className="flex w-full space-x-4">
          {tickets.map((ticket, index) => (
            <TrendingTickets key={index} ticket={ticket} />
          ))}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight pt-3">Merchandise</h2>
        <div className="flex flex-row justify-between items-center w-full overflow-x-auto">
          {merch.map((merch, index) => (
            <TrendingMerch key={index} merch={merch} />
          ))}
        </div>
      </div>
    </>
  );
}

function TrendingTickets({ ticket }: { ticket: TicketCollection }) {
  return (
    <Card className="flex flex-col items-center p-4">
      <img src={ticket.commonIpfsUrl || "https://via.placeholder.com/150"} alt="Ticket Image" className="w-25 h-25 object-cover rounded-full mx-auto my-3" />
      <CardTitle className="text-center">Ticket for {ticket.address}</CardTitle>
      <CardContent>
        <p>Owner: {ticket.owner}</p>
        <p>Price: {ticket.ticketPrice}</p>
      </CardContent>
    </Card>
  );
}

function TrendingMerch({ merch }: { merch: Merchandise }) {
  return (
    <Card className="flex flex-col items-center p-4">
      <CardTitle>Merchandise from {merch.contract_address}</CardTitle>
      {(merch.merchItems || []).map((item, index) => (
        <div key={index} className="my-2">
          <p>{item.name} - {item.price}</p>
          <p>Supply Cap: {item.supplyCap}, Sold: {item.sold ?? 0}</p>
        </div>
      ))}
    </Card>
  );
}
