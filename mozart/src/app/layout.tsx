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
                <div className="bg-background bg-[#dafef1] h-full">
                  <div className="grid lg:grid-cols-5 h-full">
                    <Sidebar />
                    <div className="col-span-3 lg:col-span-4 lg:border-l overflow-auto">
                      <div className="border-t-2 border-black">
                        <header className="text pt-8 text-center text-4xl font-bold">
                          Arya
                        </header>
                        <div className="justify-center items-center">
                          <p className="italic px-4 pb-2">
                            Invest in your creators
                          </p>
                        </div>
                      </div>
                      <Separator className="bg-[#211f1c]"></Separator>
                      <div className="h-full bg-[#f1fffb]">{children}</div>
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
