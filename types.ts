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

// Window Ethereum Type Definition for Ethers
declare global {
  interface Window {
    ethereum?: any;
  }
}