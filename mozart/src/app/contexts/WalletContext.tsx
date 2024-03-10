// WalletContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  FunctionComponent,
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
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletButtonText, setWalletButtonText] =
    useState<string>("Link Wallet");

  const handleWalletLink = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected wallet account:", accounts[0]);
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        setWalletButtonText(accounts[0]);
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
