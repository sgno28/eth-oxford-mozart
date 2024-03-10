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
                    <div className="col-span-3 lg:col-span-4 lg:border-l overflow-auto relative">
                      <div className="border-t-2 border-black flex items-center justify-center relative">
                        <div className="absolute inset-0 flex justify-center">
                          <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-18 w-18"
                          />
                        </div>
                        <div className="flex-grow text-right pt-6 pr-8">
                          <header className="text text-4xl font-bold">
                            Arya
                          </header>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <p className="italic px-4 pb-1">
                          Invest in your creators
                        </p>
                      </div>
                      <Separator className="bg-[#211f1c]"></Separator>
                      <img
                        src="/background.png" // Change this to your image's path
                        alt="Background"
                        className="absolute bottom-0 right-0 h-auto max-w-full" // Adjust the size as needed
                        style={{ maxWidth: "250px", maxHeight: "250px" }} // Optional: Adjust size
                      />
                      <div className="h-full bg-[#f1fffb] pt-6">{children}</div>
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
