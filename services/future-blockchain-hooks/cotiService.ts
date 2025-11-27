// This file contains placeholder hooks for future COTI integration.
// These functions simulate blockchain interactions without real logic.

export const connectToCOTIPlaceholder = async (): Promise<boolean> => {
  // TODO: integrate real logic with COTI smart contract
  console.log("[Blockchain] Connecting to COTI network...");
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

export const requestTokenRewardPlaceholder = async (chestId: string): Promise<number> => {
  // TODO: integrate real logic with COTI smart contract
  console.log(`[Blockchain] Requesting reward for chest ${chestId}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a random reward between 10 and 100
      const reward = Math.floor(Math.random() * 90) + 10;
      resolve(reward);
    }, 500);
  });
};

export const getBalancePlaceholder = async (): Promise<number> => {
  // TODO: integrate real logic with COTI smart contract
  console.log("[Blockchain] Fetching balance...");
  return 0;
};
