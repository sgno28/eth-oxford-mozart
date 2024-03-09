import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: string;
  onSetMode: (value: "Fan" | "Creator") => void;
}
export function Sidebar({ mode, onSetMode }: SidebarProps) {
  const toggleMode = () => {
    const newMode = mode === "Fan" ? "Creator" : "Fan";
    onSetMode(newMode);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto py-4 space-y-4">
        <div className="py-2">
          <div className="px-3">
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              My {mode === "Fan" ? "Creators" : "Fans"}
            </h2>
            <p className="italic px-4">{mode} View</p>
          </div>

          <Separator className="horizontal my-2"></Separator>
          <div className="space-y-1 px-3">
            <Button variant="secondary" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Listen Now
            </Button>
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
              mode === "Fan" ? "bg-blue-500 text-white" : "text-gray-800"
            }`}
          >
            Fan
          </div>
          <div
            className={`flex-1 text-center py-2 px-2 ${
              mode === "Creator" ? "bg-blue-500 text-white" : "text-gray-800"
            }`}
          >
            Creator
          </div>
        </div>
      </div>
    </div>
  );
}
