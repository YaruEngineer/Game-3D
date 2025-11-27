import React, { useState } from 'react';
import { useWallet } from '../../wallet/useWallet';
import { onboard } from '../../services/cotiOnboardingService';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { BrowserProvider } from 'ethers';

export const OnboardingScreen: React.FC = () => {
  const { account } = useWallet();
  const setAesKey = useOnboardingStore((state) => state.setAesKey);
  const setIsOnboarded = useOnboardingStore((state) => state.setIsOnboarded);
  const setGameStarted = useOnboardingStore((state) => state.setGameStarted);
  
  const [localAesKey, setLocalAesKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleOnboard = async () => {
    if (!window.ethereum) return;
    
    setIsLoading(true);
    setError(null);
    setStatus("Onboarding in progress...");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Note: The strict onboard function requires wallet.privateKey.
      // In a standard browser environment with MetaMask, the signer does not expose the private key.
      // This call will likely fail unless the signer object is augmented or a specific wallet instance is used.
      const key = await onboard(signer);
      
      // Store in local state as requested
      setLocalAesKey(key);
      
      // Persist to global store for game usage
      setAesKey(key);
      setIsOnboarded(true);
      
      setStatus("Onboarding successful.");
    } catch (err: any) {
      console.error("Onboarding failed", err);
      setError(err.message || "Unknown error during onboarding");
      setStatus("Onboarding failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="flex flex-col items-center bg-gray-900 border border-indigo-500/30 p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        <div className="mb-8 p-6 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <ShieldCheck className="w-12 h-12 text-indigo-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">COTI Onboarding</h1>
        <p className="text-gray-400 mb-8 text-center text-sm">
          To play COTI Realms, you must onboard your account to the privacy network.
        </p>

        {status && (
           <div className={`mb-6 text-sm font-medium ${error ? 'text-red-400' : 'text-indigo-300'}`}>
             {status}
           </div>
        )}

        {!localAesKey ? (
          <button
            onClick={handleOnboard}
            disabled={isLoading}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
              flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-gray-700 cursor-not-allowed opacity-70' 
                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Onboard Account</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleStartGame}
            className="w-full py-4 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-200 active:scale-95"
          >
            Start Game
          </button>
        )}
        
        <div className="mt-6 text-xs text-gray-600 text-center">
            Connected: {account?.slice(0,6)}...{account?.slice(-4)}
        </div>
      </div>
    </div>
  );
};