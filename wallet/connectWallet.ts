
import { BrowserProvider } from "ethers";
import { COTI_NETWORK_PARAMS, COTI_CHAIN_ID_HEX } from "./network";

// Helper to get the browser provider
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  return null;
};

// Connect Wallet Function
export const connectWallet = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  const provider = new BrowserProvider(window.ethereum);
  
  // Request account access
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found.");
  }

  // Get current network
  const network = await provider.getNetwork();
  
  return {
    address: accounts[0],
    chainId: network.chainId,
    provider,
  };
};

// Switch Network Function
export const switchToCotiNetwork = async () => {
  if (typeof window === "undefined" || !window.ethereum) return;

  const provider = new BrowserProvider(window.ethereum);

  try {
    // Try switching to COTI
    await provider.send("wallet_switchEthereumChain", [
      { chainId: COTI_CHAIN_ID_HEX },
    ]);
  } catch (switchError: any) {
    // This error code 4902 indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902 || switchError.error?.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [COTI_NETWORK_PARAMS]);
      } catch (addError) {
        console.error("Failed to add COTI network:", addError);
        throw addError;
      }
    } else {
      console.error("Failed to switch network:", switchError);
      throw switchError;
    }
  }
};
