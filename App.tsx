import React, { useEffect, useState } from 'react';
import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { Minimap } from './components/Game/Minimap';
import { ConnectScreen } from './components/UI/ConnectScreen';
import { useWallet } from './wallet/useWallet';

function App() {
  const wallet = useWallet();
  const [gameReady, setGameReady] = useState(false);

  // Effect: Gatekeeper Logic
  useEffect(() => {
    // Only allow game start if connected AND on correct network
    if (wallet.isConnected && wallet.isCorrectNetwork) {
      const timer = setTimeout(() => setGameReady(true), 500); // Small delay for smooth transition
      return () => clearTimeout(timer);
    } else {
      // If disconnected or wrong network, immediately stop game
      setGameReady(false);
    }
  }, [wallet.isConnected, wallet.isCorrectNetwork]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      
      {/* Wallet Gate UI - Always shows if not ready */}
      {!gameReady && (
        <ConnectScreen wallet={wallet} />
      )}

      {/* Game Engine - Only mounts if ready */}
      {gameReady && (
        <>
          {/* 3D Layer - Game Root */}
          <div id="game-root" className="absolute inset-0 z-0">
             <Scene />
          </div>

          {/* HUD Layer - React Root Overlay */}
          <div id="react-root" className="absolute inset-0 z-10 pointer-events-none">
            <HUD />
            <Minimap />
            
            {/* Debug/Info: Connected Account */}
            <div className="absolute top-2 right-2 pointer-events-auto bg-black/40 text-gray-500 text-[10px] px-2 py-1 rounded border border-gray-800">
              {wallet.account?.slice(0, 6)}...{wallet.account?.slice(-4)} | COTI
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;