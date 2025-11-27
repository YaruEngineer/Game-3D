import React from 'react';
import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { Minimap } from './components/Game/Minimap';
import { ConnectScreen } from './components/UI/ConnectScreen';
import { WrongNetwork } from './components/UI/WrongNetwork';
import { useWallet } from './wallet/useWallet';

function App() {
  const { 
    isConnected, 
    isConnecting, 
    isCorrectChain, 
    connect, 
    switchChain, 
    error 
  } = useWallet();

  // 1. Loading State (optional, keeps UI clean while checking connection)
  if (isConnecting && !isConnected) {
    return <ConnectScreen onConnect={() => {}} isConnecting={true} error={null} />;
  }

  // 2. Not Connected State
  if (!isConnected) {
    return (
      <ConnectScreen 
        onConnect={connect} 
        isConnecting={isConnecting} 
        error={error} 
      />
    );
  }

  // 3. Wrong Network State
  if (!isCorrectChain) {
    return (
      <WrongNetwork 
        onSwitch={switchChain} 
        isConnecting={isConnecting}
        error={error}
      />
    );
  }

  // 4. Game Active State (Only renders when all gates are passed)
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* 3D Layer - Mounts specific Scene component which contains Canvas */}
      <div className="absolute inset-0 z-0" id="game-root">
        <Scene />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none" id="react-root">
        <HUD />
        <Minimap />
      </div>
    </div>
  );
}

export default App;
