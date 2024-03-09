"use client";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { useMode } from "@/app/contexts/ModeContext";
import { useRouter } from "next/navigation";
import { RatIcon, BusIcon, BabyIcon, PlusIcon, CandlestickChart } from "lucide-react";
import { LucideIcon } from "lucide-react/dist/lucide-react"

type SidebarItem = {
  name: string;
  route: string;
  icon: LucideIcon;
};

export function Sidebar() {
  const { mode, setMode } = useMode();
  const router = useRouter();

  const fan_routes: SidebarItem[] = [
    { name: "Discover", route: "/fan/discover", icon: RatIcon },
    { name: "Hello", route: "/fan/my-creators", icon: BusIcon },
    { name: "Mother", route: "/creator/my-bond", icon: BabyIcon },
  ];

  const creator_routes: SidebarItem[] = [
    { name: "Add bond", route: "/creator/add-bond", icon: PlusIcon },
    { name: "Bond Dashboard", route: "/creator/my-bond", icon: CandlestickChart },
  ];

  const toggleMode = () => {
    const newMode = mode === "Fan" ? "Creator" : "Fan";
    setMode(newMode);

    const targetPath = newMode === "Fan" ? "/fan" : "/creator";
    router.push(targetPath);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto py-4 space-y-4">
        <div className="py-2">
          <div
            className="px-3 cursor-pointer"
            onClick={() => {
              const targetPath =
                mode === "Fan" ? "/fan/my-creators" : "/creator/my-bond";
              router.push(targetPath);
            }}
          >
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              My {mode === "Fan" ? "Creators" : "Fans"}
            </h2>
            <p className="italic px-4">{mode} View</p>
          </div>

          <Separator className="horizontal my-2"></Separator>
          <div className="space-y-1 px-3">
            {mode === "Fan"
              ? fan_routes.map((route: SidebarItem) => (
                  <Button
                    key={route.route}
                    variant="secondary"
                    className="w-full justify-start mb-1"
                    onClick={() => router.push(route.route)}
                  >
                    <route.icon className="mr-2"/>
                    {route.name}
                  </Button>
                ))
              : creator_routes.map((route: SidebarItem) => (
                  <Button
                    key={route.name}
                    variant="secondary"
                    className="w-full justify-start mb-1"
                    onClick={() => router.push(route.route)}
                  >
                    <route.icon className="mr-2"/>
                    {route.name}
                  </Button>
                ))}
          </div>
        </div>
      </div>
      
          <div className="px-3 py-6 flex justify-center items-center">
            <p className="px-2">Switch Mode</p>
            <div
              onClick={toggleMode}
              className="border rounded-md cursor-pointer overflow-hidden flex"
            >
              <div
                className={`flex-1 text-center py-2 px-2 ${
                  mode === "Fan" ? "bg-black text-white" : "text-gray-800"
                }`}
              >
                Fan
              </div>
              <div
                className={`flex-1 text-center py-2 px-2 ${
                  mode === "Creator" ? "bg-black text-white" : "text-gray-800"
                }`}
              >
                Creator
              </div>
            </div>
          </div>
        </div>
  );
}
