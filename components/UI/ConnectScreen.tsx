import React from 'react';
import { Wallet } from 'lucide-react';

interface ConnectScreenProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const ConnectScreen: React.FC<ConnectScreenProps> = ({ onConnect, isConnecting, error }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
      <div className="flex flex-col items-center bg-gray-900/50 backdrop-blur-xl border border-gray-700 p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        {/* Logo / Icon */}
        <div className="mb-8 p-6 bg-blue-500/10 rounded-full border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <Wallet className="w-12 h-12 text-blue-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">COTI Realms</h1>
        <p className="text-gray-400 mb-8 text-center text-sm">
          Connect your wallet to enter the prototype.
          <br />Requires COTI Mainnet.
        </p>

        {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm text-center w-full">
                {error}
            </div>
        )}

        <button
          onClick={onConnect}
          disabled={isConnecting}
          className={`
            w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
            flex items-center justify-center gap-2
            ${isConnecting 
              ? 'bg-gray-700 cursor-not-allowed opacity-70' 
              : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95'
            }
          `}
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
