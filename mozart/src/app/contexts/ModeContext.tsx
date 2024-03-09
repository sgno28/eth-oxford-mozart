"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface ModeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const defaultState = {
  mode: "Fan",
  setMode: () => {},
};

const ModeContext = createContext<ModeContextType>(defaultState);

export const useMode = () => useContext(ModeContext);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<string>("Fan");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
