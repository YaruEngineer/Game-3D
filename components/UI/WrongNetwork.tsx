import React from 'react';
import { AlertTriangle, Network } from 'lucide-react';

interface WrongNetworkProps {
  onSwitch: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const WrongNetwork: React.FC<WrongNetworkProps> = ({ onSwitch, isConnecting, error }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-gray-900 border border-yellow-600/50 p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center">
        
        <div className="mb-6 p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Wrong Network</h2>
        <p className="text-gray-400 mb-6 text-sm">
          This application requires the <strong>COTI Mainnet</strong>.
          <br/>Please switch your wallet network to continue.
        </p>

        {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm w-full">
                {error}
            </div>
        )}

        <button
          onClick={onSwitch}
          disabled={isConnecting}
          className="w-full py-3 px-6 rounded-lg font-semibold text-black bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
        >
          {isConnecting ? (
             <span className="opacity-80">Switching...</span>
          ) : (
            <>
              <Network size={18} />
              <span>Switch to COTI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
