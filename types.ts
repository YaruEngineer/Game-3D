export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ChestData {
  id: string;
  position: [number, number, number];
  isOpen: boolean;
}

export interface LogMessage {
  id: number;
  text: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning';
}

export interface GameState {
  balance: number;
  playerTarget: [number, number, number] | null;
  playerPosition: [number, number, number];
  logs: LogMessage[];
  chests: ChestData[];
  setPlayerTarget: (target: [number, number, number]) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  openChest: (id: string) => void;
  addLog: (text: string, type?: 'info' | 'success' | 'warning') => void;
  incrementBalance: (amount: number) => void;
}

// COTI SDK Types (Approximation for TypeScript)
export interface RSAKeyPair {
  privateKey: string;
  publicKey: string;
}

export interface OnboardingState {
  rsaKeyPair: RSAKeyPair | null;
  userKey: string | null;
  aesKey: Uint8Array | null;
  isOnboarded: boolean;
  isOnboarding: boolean;
  isGameStarted: boolean;
  error: string | null;
  onboard: (signer: any) => Promise<void>;
  startGame: () => void;
  reset: () => void;
}

// Add global window type for Ethers
declare global {
  interface Window {
    ethereum?: any;
  }
}