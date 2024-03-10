"use client";

import { useMode } from "./contexts/ModeContext";
import FanPage from "./fan/page";
import CreatorPage from "./creator/page";

export default function HomePage() {
  const { mode, setMode } = useMode();

  return <>{mode === "Fan" ? <FanPage /> : <CreatorPage />}</>;
}
