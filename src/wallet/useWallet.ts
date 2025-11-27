import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { connectWallet, switchNetwork } from './connectWallet';
import { isCotiNetwork } from './network';

export interface UseWalletReturn {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: () => Promise<void>;
}

export const useWallet = (): UseWalletReturn => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          setAccount(accounts[0].address);
          setChainId(Number(network.chainId));
        }
      } catch (err) {
        console.error("Failed to check connection:", err);
      }
    }
  }, []);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Re-fetch chain ID when account changes just in case
          checkConnection();
        } else {
          setAccount(null);
          setChainId(null);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(Number(chainIdHex));
        window.location.reload(); // Recommended by Ethers/Metamask docs to reload on chain change to avoid state issues
      };

      const handleDisconnect = () => {
        setAccount(null);
        setChainId(null);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [checkConnection]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const { address, chainId } = await connectWallet();
      setAccount(address);
      setChainId(chainId);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // Ethers/Metamask doesn't strictly support programmatic disconnect from the app side
    // We just clear our local state
    setAccount(null);
    setChainId(null);
  };

  return {
    account,
    chainId,
    isConnected: !!account,
    isCorrectNetwork: chainId ? isCotiNetwork(chainId) : false,
    isConnecting,
    error,
    connect,
    disconnect,
    switchChain: switchNetwork
  };
};