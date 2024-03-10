"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  FunctionComponent,
  useEffect,
} from "react";

interface WalletContextType {
  isWalletConnected: boolean;
  walletAddress: string;
  walletButtonText: string;
  handleWalletLink: () => Promise<void>;
}

const defaultContextValue: WalletContextType = {
  isWalletConnected: false,
  walletAddress: "",
  walletButtonText: "Link Wallet",
  handleWalletLink: async () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContextValue);

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FunctionComponent<WalletProviderProps> = ({
  children,
}) => {
  // Initialize state from localStorage, or use defaults
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(
    localStorage.getItem("isWalletConnected") === "true"
  );
  const [walletAddress, setWalletAddress] = useState<string>(
    localStorage.getItem("walletAddress") || ""
  );
  const [walletButtonText, setWalletButtonText] = useState<string>(
    localStorage.getItem("walletButtonText") || "Link Wallet"
  );

  useEffect(() => {
    // Persist state changes to localStorage
    localStorage.setItem(
      "isWalletConnected",
      JSON.stringify(isWalletConnected)
    );
    localStorage.setItem("walletAddress", walletAddress);
    localStorage.setItem("walletButtonText", walletButtonText);
  }, [isWalletConnected, walletAddress, walletButtonText]); // Only re-run the effect if these values change

  const handleWalletLink = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        setWalletButtonText(accounts[0]); // You might want to change this to a more descriptive text
        console.log(
          "Connected wallet account:",
          accounts[0],
          isWalletConnected
        );
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("Install a wallet to get started!");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected,
        walletAddress,
        walletButtonText,
        handleWalletLink,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
