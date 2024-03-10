"use client";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { ModeProvider } from "./contexts/ModeContext";
import { Separator } from "@/ui/separator";
import { Sidebar } from "@/ui/sidebar";
import { WalletProvider } from "./contexts/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <ModeProvider>
            <div className="hidden md:block min-h-screen">
              <div className="border-t">
                <div className="bg-background h-full">
                  <div className="grid lg:grid-cols-5 h-full">
                    <Sidebar />
                    <div className="col-span-3 lg:col-span-4 lg:border-l overflow-auto">
                      <header className="text-black p-3 text-center text-xl font-bold">
                        Arria
                      </header>
                      <div className="justify-center items-center">
                        <p className="italic px-4">Invest in your creators</p>
                      </div>
                      <Separator className="horizontal my-2"></Separator>
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModeProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
