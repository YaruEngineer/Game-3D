import { create } from 'zustand';
import { OnboardingState } from '../types';
import { onboardAccount } from '../services/cotiOnboardingService';

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  rsaKeyPair: null,
  userKey: null,
  aesKey: null,
  isOnboarded: false,
  isOnboarding: false,
  isGameStarted: false,
  error: null,

  onboard: async (signer: any) => {
    set({ isOnboarding: true, error: null });
    try {
      // 1. Run COTI Onboarding logic via Service
      const { rsaKeyPair, userKey } = await onboardAccount(signer);

      // 2. Generate AES Session Key
      const aesKey = crypto.getRandomValues(new Uint8Array(32));

      set({
        rsaKeyPair,
        userKey,
        aesKey,
        isOnboarded: true,
        isOnboarding: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      // Ensure we only store string errors to avoid React Error #31
      set({ 
        isOnboarding: false, 
        error: err.message || "Unknown onboarding error occurred." 
      });
    }
  },

  startGame: () => {
    const { isOnboarded } = get();
    if (isOnboarded) {
      set({ isGameStarted: true });
    }
  },

  reset: () => {
    set({
      rsaKeyPair: null,
      userKey: null,
      aesKey: null,
      isOnboarded: false,
      isOnboarding: false,
      isGameStarted: false,
      error: null,
    });
  }
}));