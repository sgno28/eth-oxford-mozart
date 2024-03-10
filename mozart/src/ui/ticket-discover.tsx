import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { Merchandise, TicketCollection } from "@/lib/interfaces";
import { Card, CardTitle, CardContent } from "@/ui/card";
import Link from "next/link";

const db = getFirestore(app);

export default function TicketDiscover() {
  const [tickets, setTickets] = useState<TicketCollection[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "creators"));
        
        const fetchedTickets: TicketCollection[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Assuming ticketCollections is an array of TicketCollection
          if (data.ticketCollections) {
            fetchedTickets.push(...data.ticketCollections.map(tc => ({
              owner: tc.owner || null,
              address: tc.address || null,
              commonIpfsUrl: tc.commonIpfsUrl,
              ticketPrice: tc.ticketPrice,
              artistName: data.name,
            })));
          }
        });

        setTickets(fetchedTickets);
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
      </div>
    </>
  );
}

function TrendingTickets({ ticket }: { ticket: TicketCollection }) {
    const imageStyle = "w-24 h-24 object-cover rounded-full mx-auto"; // Width and height set to 24, adjust as needed

    return (
        <Link href={`/fan/ticket-marketplace/${ticket.address}`}>
            <Card className="flex flex-col items-center p-4 max-w-xs w-full mt-2"> {/* Ensure cards have a max width */}
                <img 
                src={ticket.commonIpfsUrl || "https://via.placeholder.com/150"} 
                alt="Ticket Image" 
                className={imageStyle} // Apply the consistent image dimensions
                />
                <CardTitle className="text-center mt-4">{ticket.artistName || "Unknown Artist"}</CardTitle> {/* Use artistName if available */}
                <CardContent className="text-center mt-1">
                <p>Price: {ticket.ticketPrice} XTZ</p>
                </CardContent>
            </Card>
       </Link>
    );
  }
