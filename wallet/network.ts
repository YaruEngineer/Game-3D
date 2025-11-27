export const COTI_MAINNET = {
  chainId: 2632500,
  chainIdHex: "0x282a74",
  name: "COTI Mainnet",
  rpcUrl: "https://mainnet.coti.io/rpc",
  explorer: "https://mainnet.cotiscan.io",
  currencySymbol: "COTI"
};

export const isCotiNetwork = (chainId: number | bigint | string): boolean => {
  // Convert to number for safe comparison
  const id = Number(chainId);
  return id === COTI_MAINNET.chainId;
};