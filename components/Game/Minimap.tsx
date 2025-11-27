import React from 'react';
import { useGameStore } from '../../store/gameStore';

export const Minimap: React.FC = () => {
  const playerPosition = useGameStore((state) => state.playerPosition);
  const chests = useGameStore((state) => state.chests);

  // Map settings
  const mapSize = 150; // pixel size on screen
  const worldRange = 400; // The area of the world we are mapping (relative to 0,0)
  
  // Helper to convert world pos to map css percent
  const worldToMap = (val: number) => {
    // Map -200..200 to 0..100%
    const percent = ((val + (worldRange/2)) / worldRange) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  return (
    <div className="fixed bottom-6 right-6 w-[150px] h-[150px] bg-gray-900 border-2 border-gray-600 rounded-lg overflow-hidden opacity-90 shadow-2xl z-50 pointer-events-none">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Center Marker (Origin) */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Chests */}
        {chests.map(chest => (
            !chest.isOpen && (
                <div 
                    key={chest.id}
                    className="absolute w-1.5 h-1.5 bg-yellow-500 rounded-full"
                    style={{
                        left: `${worldToMap(chest.position[0])}%`,
                        top: `${worldToMap(chest.position[2])}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            )
        ))}

        {/* Player */}
        <div 
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
            style={{
                left: `${worldToMap(playerPosition[0])}%`,
                top: `${worldToMap(playerPosition[2])}%`,
                transform: 'translate(-50%, -50%)'
            }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-center text-gray-400 py-0.5">
            MINIMAP
        </div>
    </div>
  );
};