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

// Add global window type for Ethers and R3F JSX elements
declare global {
  interface Window {
    ethereum?: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      fog: any;
      mesh: any;
      group: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      gridHelper: any;
      capsuleGeometry: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      coneGeometry: any;
      cylinderGeometry: any;
      dodecahedronGeometry: any;
    }
  }
}
