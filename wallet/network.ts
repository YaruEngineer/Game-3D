export const COTI_CHAIN_ID_DECIMAL = 2632500;
export const COTI_CHAIN_ID_HEX = "0x" + COTI_CHAIN_ID_DECIMAL.toString(16);

export const COTI_NETWORK_PARAMS = {
  chainId: COTI_CHAIN_ID_HEX,
  chainName: "COTI Mainnet",
  nativeCurrency: {
    name: "COTI",
    symbol: "COTI",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.coti.io/rpc"],
  blockExplorerUrls: ["https://mainnet.cotiscan.io"],
};

export const isCotiNetwork = (chainId: string | number | bigint): boolean => {
  // Handle various formats ethers might return (bigint, number, hex string)
  if (typeof chainId === "string") {
    return chainId.toLowerCase() === COTI_CHAIN_ID_HEX.toLowerCase();
  }
  return Number(chainId) === COTI_CHAIN_ID_DECIMAL;
};
