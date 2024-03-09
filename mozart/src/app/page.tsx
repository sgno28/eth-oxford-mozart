"use client";
import { Separator } from "@/ui/separator";
import { Sidebar } from "@/ui/sidebar";
import { useState } from "react";
import FanPage from "./fan/page";
import CreatorPage from "./creator/page";

export default function HomePage() {
  const [mode, setMode] = useState("Fan");

  return (
    <>
      <div className="hidden md:block min-h-screen">
        <div className="border-t">
          <div className="bg-background h-full">
            <div className="grid lg:grid-cols-5 h-full">
              <Sidebar mode={mode} onSetMode={setMode} />
              <div className="col-span-3 lg:col-span-4 lg:border-l overflow-auto">
                <header className="text-black p-3 text-center text-xl font-bold">
                  Arria
                </header>
                <div className="justify-center items-center">
                  <p className="italic px-4">Invest in your creators</p>
                </div>
                <Separator className="horizontal my-2"></Separator>

                {mode === "Fan" ? <FanPage /> : <CreatorPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
