import { BrowserProvider } from 'ethers';
import { COTI_MAINNET } from './network';

export interface WalletConnection {
  address: string;
  chainId: number;
  provider: BrowserProvider;
}

export const connectWallet = async (): Promise<WalletConnection> => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install Metamask.");
  }

  const provider = new BrowserProvider(window.ethereum);
  
  // Request accounts
  await provider.send("eth_requestAccounts", []);
  
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  return {
    address,
    chainId: Number(network.chainId),
    provider
  };
};

export const switchNetwork = async () => {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: COTI_MAINNET.chainIdHex }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: COTI_MAINNET.chainIdHex,
              chainName: COTI_MAINNET.name,
              nativeCurrency: {
                name: 'COTI',
                symbol: COTI_MAINNET.currencySymbol,
                decimals: 18,
              },
              rpcUrls: [COTI_MAINNET.rpcUrl],
              blockExplorerUrls: [COTI_MAINNET.explorer],
            },
          ],
        });
      } catch (addError) {
        console.error("Failed to add network:", addError);
        throw addError;
      }
    } else {
      console.error("Failed to switch network:", switchError);
      throw switchError;
    }
  }
};