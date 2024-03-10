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
  handleWalletDisconnect: () => void;
}

const defaultContextValue: WalletContextType = {
  isWalletConnected: false,
  walletAddress: "",
  walletButtonText: "Link Wallet",
  handleWalletLink: async () => {},
  handleWalletDisconnect: () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContextValue);

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FunctionComponent<WalletProviderProps> = ({
  children,
}) => {
  // Initialize state with values from localStorage if available
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(
    JSON.parse(localStorage.getItem("isWalletConnected") || "false")
  );
  const [walletAddress, setWalletAddress] = useState<string>(
    localStorage.getItem("walletAddress") || ""
  );
  const [walletButtonText, setWalletButtonText] = useState<string>(
    localStorage.getItem("walletButtonText") || "Link Wallet"
  );

  useEffect(() => {
    // Update localStorage whenever state changes
    localStorage.setItem(
      "isWalletConnected",
      JSON.stringify(isWalletConnected)
    );
    localStorage.setItem("walletAddress", walletAddress);
    localStorage.setItem("walletButtonText", walletButtonText);
  }, [isWalletConnected, walletAddress, walletButtonText]);

  const handleWalletLink = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const newWalletAddress = accounts[0];
        setWalletAddress(newWalletAddress);
        setIsWalletConnected(true);
        setWalletButtonText(newWalletAddress); // Adjust this as needed
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.log("Install a wallet to get started!");
    }
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setWalletButtonText("Link Wallet");
    localStorage.removeItem("isWalletConnected");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletButtonText");
  };

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected,
        walletAddress,
        walletButtonText,
        handleWalletLink,
        handleWalletDisconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
