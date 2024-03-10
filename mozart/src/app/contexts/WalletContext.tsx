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
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletButtonText, setWalletButtonText] =
    useState<string>("Link Wallet");

  useEffect(() => {
    console.log(" WALLET CONTEXT EFFECT");
    const storedIsConnected =
      localStorage.getItem("isWalletConnected") === "true";
    console.log("storeedIsConnected In wallet context", storedIsConnected);
    const storedWalletAddress = localStorage.getItem("walletAddress") || "";
    const storedButtonText =
      localStorage.getItem("storedButtonText") || "Link Wallet";
    setIsWalletConnected(storedIsConnected);
    setWalletAddress(storedWalletAddress);
    setWalletButtonText(storedButtonText);
  }, []);

  const handleWalletLink = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const connectedAddress = accounts[0];
        console.log("Connected wallet account:", connectedAddress);

        // Update state
        setWalletAddress(connectedAddress);
        setIsWalletConnected(true);
        setWalletButtonText(accounts[0]);

        // Store in localStorage
        localStorage.setItem("isWalletConnected", "true");
        localStorage.setItem("walletAddress", connectedAddress);
        localStorage.setItem("storedButtonText", accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        localStorage.setItem("isWalletConnected", "false"); // Ensure to reset if there was an error
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
