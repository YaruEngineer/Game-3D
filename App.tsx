import React from 'react';
import { Scene } from './components/Game/Scene';
import { HUD } from './components/UI/HUD';
import { Minimap } from './components/Game/Minimap';

function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <HUD />
        <Minimap />
      </div>
    </div>
  );
}

export default App;