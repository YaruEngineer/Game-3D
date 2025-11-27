import React from 'react';
import { Wallet, AlertTriangle, ArrowRight } from 'lucide-react';
import { UseWalletReturn } from '../../wallet/useWallet';

interface ConnectScreenProps {
  wallet: UseWalletReturn;
}

export const ConnectScreen: React.FC<ConnectScreenProps> = ({ wallet }) => {
  const { isConnected, isCorrectNetwork, isConnecting, error, connect, switchChain } = wallet;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <div className="relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-blue-900/30 rounded-full border border-blue-500/30">
              <Wallet className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">COTI Realms</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to enter the 3D Prototype.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-left">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {!isConnected ? (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect Wallet <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : !isCorrectNetwork ? (
             <div className="space-y-4">
                <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                    <p className="text-yellow-500 text-sm font-medium">Wrong Network Detected</p>
                    <p className="text-yellow-200/60 text-xs mt-1">Please connect to COTI Mainnet (ID: 2632500)</p>
                </div>
                <button
                  onClick={switchChain}
                  className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(202,138,4,0.3)]"
                >
                  Switch to COTI Mainnet
                </button>
             </div>
          ) : (
            <div className="text-green-400 font-medium animate-pulse">
              Wallet Connected! Entering Realm...
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Powered by Three.js & Ethers.js v6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};