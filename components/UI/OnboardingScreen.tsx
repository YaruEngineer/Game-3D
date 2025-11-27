
import React from 'react';
import { ShieldCheck, Play } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { onboard } from '../../services/cotiOnboardingService';
import { useWallet } from '../../wallet/useWallet';

export const OnboardingScreen: React.FC = () => {
  const { signer } = useWallet();
  const { 
    isOnboarded, 
    loading, 
    error, 
    setOnboarded, 
    setLoading, 
    setError,
    startGame,
    aesKey
  } = useOnboardingStore();

  const handleOnboard = async () => {
    if (!signer) {
      setError("Wallet signer not available.");
      return;
    }

    setLoading(true);
    try {
      // Calling the strict implementation of onboard
      const recoveredKey = await onboard(signer);
      
      // Store the result
      setOnboarded(recoveredKey);
      
    } catch (err: any) {
      console.error(err);
      // Safely stringify error to prevent React Error #31
      setError(err.message || String(err));
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-gray-900 border border-blue-900/50 p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        <div className="mb-6 p-5 bg-blue-500/10 rounded-full border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <ShieldCheck className="w-12 h-12 text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Setup Game Account</h1>
        <p className="text-gray-400 mb-8 text-center text-sm">
          {isOnboarded 
            ? "Your account is ready for the Realm." 
            : "Generate your secure session keys to enter the game."}
        </p>

        {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-xs text-center w-full break-words">
                {error}
            </div>
        )}

        {isOnboarded ? (
          <div className="w-full space-y-4">
             <div className="p-3 bg-green-900/30 border border-green-800 rounded text-green-200 text-xs text-center">
                Onboarding Complete!
                <br/>AES Key generated.
             </div>
             
             <button
                onClick={startGame}
                className="w-full py-4 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] flex items-center justify-center gap-2"
             >
                <Play className="w-5 h-5 fill-current" />
                Start Game
             </button>
          </div>
        ) : (
          <button
            onClick={handleOnboard}
            disabled={loading}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
              ${loading 
                ? 'bg-gray-700 cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
              }
            `}
          >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Onboarding...</span>
                </div>
            ) : (
                "Onboard My Account"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
