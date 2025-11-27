import { create } from 'zustand';
import { GameState, ChestData } from '../types';

// Helper to generate random chests
const generateChests = (count: number, range: number): ChestData[] => {
  const chests: ChestData[] = [];
  for (let i = 0; i < count; i++) {
    chests.push({
      id: `chest-${i}`,
      position: [
        (Math.random() - 0.5) * range,
        0.5, // Lift slightly above ground
        (Math.random() - 0.5) * range
      ],
      isOpen: false,
    });
  }
  return chests;
};

export const useGameStore = create<GameState>((set) => ({
  balance: 0,
  playerTarget: null,
  playerPosition: [0, 1, 0],
  logs: [{ id: 0, text: "Welcome to the Realm. Click to move.", timestamp: new Date(), type: 'info' }],
  chests: generateChests(20, 200), // Generate 20 chests within 200x200 area for the demo
  
  setPlayerTarget: (target) => set({ playerTarget: target }),
  
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  
  openChest: (id) => set((state) => ({
    chests: state.chests.map(c => c.id === id ? { ...c, isOpen: true } : c)
  })),
  
  addLog: (text, type = 'info') => set((state) => ({
    logs: [
      { id: Date.now(), text, timestamp: new Date(), type },
      ...state.logs
    ].slice(0, 5) // Keep last 5 logs
  })),

  incrementBalance: (amount) => set((state) => ({
    balance: state.balance + amount
  })),
}));