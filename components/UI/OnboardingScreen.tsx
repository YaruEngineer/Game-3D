import React, { useCallback } from 'react';
import { ShieldCheck, PlayCircle, Lock } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getProvider } from '../../wallet/connectWallet'; // Helper to get provider/signer

export const OnboardingScreen: React.FC = () => {
  const { 
    isOnboarded, 
    isOnboarding, 
    error, 
    onboard, 
    startGame 
  } = useOnboardingStore();

  const handleOnboard = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
        // Should handle this better in production, but App gate ensures provider exists usually
        console.error("No provider found");
        return;
    }
    const signer = await provider.getSigner();
    onboard(signer);
  }, [onboard]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-900 to-black">
      <div className="flex flex-col items-center bg-gray-900/80 backdrop-blur-xl border border-indigo-500/30 p-10 rounded-2xl shadow-2xl max-w-lg w-full mx-4 text-center">
        
        {/* Icon State */}
        <div className={`mb-8 p-6 rounded-full border shadow-[0_0_30px_rgba(99,102,241,0.2)] ${isOnboarded ? 'bg-green-500/10 border-green-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
          {isOnboarded ? (
             <ShieldCheck className="w-12 h-12 text-green-400" />
          ) : (
             <Lock className="w-12 h-12 text-indigo-400" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isOnboarded ? "Account Ready" : "Setup Account"}
        </h1>
        
        <p className="text-gray-400 mb-8 text-sm max-w-xs mx-auto leading-relaxed">
          {isOnboarded 
            ? "Your secure session keys have been generated. You are ready to enter the Realm." 
            : "To play securely on COTI, we need to generate a privacy-preserving session key for your account."
          }
        </p>

        {/* Error Display - strictly string */}
        {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg text-red-200 text-xs text-left w-full break-words font-mono">
                Error: {error}
            </div>
        )}

        {/* Actions */}
        {!isOnboarded ? (
            <button
            onClick={handleOnboard}
            disabled={isOnboarding}
            className={`
                w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
                flex items-center justify-center gap-3
                ${isOnboarding
                ? 'bg-gray-700 cursor-not-allowed opacity-70' 
                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95'
                }
            `}
            >
            {isOnboarding ? (
                <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Onboarding Account...</span>
                </>
            ) : (
                <>
                <span>Onboard My Account</span>
                </>
            )}
            </button>
        ) : (
            <button
                onClick={startGame}
                className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-500 hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
                <PlayCircle className="w-5 h-5" />
                <span>Start Game</span>
            </button>
        )}
        
        {!isOnboarded && !isOnboarding && (
            <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest">
                Powered by COTI MPC
            </p>
        )}
      </div>
    </div>
  );
};