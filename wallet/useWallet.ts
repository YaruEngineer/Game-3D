
import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Signer } from "ethers";
import { connectWallet, switchToCotiNetwork } from "./connectWallet";
import { isCotiNetwork } from "./network";

interface WalletState {
  account: string | null;
  chainId: bigint | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectChain: boolean;
  error: string | null;
  signer: Signer | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    isConnected: false,
    isConnecting: true,
    isCorrectChain: false,
    error: null,
    signer: null
  });

  const updateWalletState = useCallback(async (accounts: string[]) => {
    if (typeof window === "undefined" || !window.ethereum) {
        setState(s => ({ ...s, isConnecting: false }));
        return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const account = accounts.length > 0 ? accounts[0] : null;
      const signer = account ? await provider.getSigner() : null;
      
      setState({
        account,
        chainId: network.chainId,
        isConnected: !!account,
        isConnecting: false,
        isCorrectChain: isCotiNetwork(network.chainId),
        error: null,
        signer
      });
    } catch (err) {
      console.error("Failed to update wallet state", err);
      setState(s => ({ ...s, isConnecting: false, error: "Failed to detect wallet state" }));
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
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

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("Accounts changed:", accounts);
      updateWalletState(accounts);
    };

    const handleChainChanged = (_chainId: string) => {
      console.log("Chain changed, reloading state...");
      window.location.reload(); 
    };

    const handleDisconnect = () => {
      setState(s => ({ ...s, isConnected: false, account: null, signer: null }));
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
      const { address, chainId, provider } = await connectWallet();
      const signer = await provider.getSigner();
      setState({
        account: address,
        chainId: chainId,
        isConnected: true,
        isConnecting: false,
        isCorrectChain: isCotiNetwork(chainId),
        error: null,
        signer
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
