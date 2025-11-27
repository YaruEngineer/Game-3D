import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { connectWallet, switchToCotiNetwork } from "./connectWallet";
import { isCotiNetwork } from "./network";

interface WalletState {
  account: string | null;
  chainId: bigint | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectChain: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: true, // Start true to check connection on load
    isCorrectChain: false,
    error: null,
  });

  // Handler to update state based on provider info
  const updateWalletState = useCallback(async (accounts: string[]) => {
    if (!window.ethereum) {
        setState(s => ({ ...s, isConnecting: false }));
        return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const account = accounts.length > 0 ? accounts[0] : null;
      
      setState({
        account,
        chainId: network.chainId,
        isConnected: !!account,
        isConnecting: false,
        isCorrectChain: isCotiNetwork(network.chainId),
        error: null,
      });
    } catch (err) {
      console.error("Failed to update wallet state", err);
      setState(s => ({ ...s, isConnecting: false, error: "Failed to detect wallet state" }));
    }
  }, []);

  // Check initial connection
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        try {
            const accounts = await provider.send("eth_accounts", []);
            await updateWalletState(accounts);
        } catch (e) {
            console.error(e);
            setState(s => ({ ...s, isConnecting: false }));
        }
      } else {
        setState(s => ({ ...s, isConnecting: false }));
      }
    };
    checkConnection();
  }, [updateWalletState]);

  // Event Listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed:", accounts);
      updateWalletState(accounts);
    };

    const handleChainChanged = (_chainId: string) => {
      // It is recommended to reload the page on chain change, 
      // but here we just update state to trigger re-render of gate
      console.log("Chain changed, reloading state...");
      window.location.reload(); 
    };

    const handleDisconnect = () => {
      setState(s => ({ ...s, isConnected: false, account: null }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [updateWalletState]);

  const connect = async () => {
    setState(s => ({ ...s, isConnecting: true, error: null }));
    try {
      const { address, chainId } = await connectWallet();
      setState({
        account: address,
        chainId: chainId,
        isConnected: true,
        isConnecting: false,
        isCorrectChain: isCotiNetwork(chainId),
        error: null,
      });
    } catch (err: any) {
      console.error(err);
      setState(s => ({ ...s, isConnecting: false, error: err.message || "Failed to connect" }));
    }
  };

  const switchChain = async () => {
    setState(s => ({ ...s, isConnecting: true }));
    try {
      await switchToCotiNetwork();
      // The chainChanged event will trigger the reload/update
    } catch (err: any) {
      setState(s => ({ ...s, isConnecting: false, error: err.message || "Failed to switch network" }));
    }
  };

  return {
    ...state,
    connect,
    switchChain,
  };
};
