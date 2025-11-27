
import { create } from 'zustand';

interface OnboardingState {
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
  aesKey: string | null; // Using string as it comes from recoverUserKey in the example
  isGameStarted: boolean;
  
  setOnboarded: (aesKey: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startGame: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOnboarded: false,
  loading: false,
  error: null,
  aesKey: null,
  isGameStarted: false,

  setOnboarded: (aesKey) => set({ 
    isOnboarded: true, 
    aesKey, 
    loading: false, 
    error: null 
  }),
  
  setLoading: (loading) => set({ loading, error: null }),
  
  setError: (error) => set({ error, loading: false }),
  
  startGame: () => set({ isGameStarted: true }),
}));
