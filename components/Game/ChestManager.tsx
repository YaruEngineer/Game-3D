import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Vector3 } from 'three';
import { Html } from '@react-three/drei';
import { requestTokenRewardPlaceholder } from '../../services/future-blockchain-hooks/cotiService';

const INTERACTION_DISTANCE = 8;

interface ChestProps {
  id: string;
  position: [number, number, number];
  isOpen: boolean;
  playerPosition: [number, number, number];
}

const Chest: React.FC<ChestProps> = ({ id, position, isOpen, playerPosition }) => {
  const openChest = useGameStore((state) => state.openChest);
  const addLog = useGameStore((state) => state.addLog);
  const incrementBalance = useGameStore((state) => state.incrementBalance);

  const handleInteraction = async (e: any) => {
    e.stopPropagation(); // Stop click from hitting terrain (moving player)

    if (isOpen) return;

    const chestVec = new Vector3(...position);
    const playerVec = new Vector3(...playerPosition);
    const dist = chestVec.distanceTo(playerVec);

    if (dist <= INTERACTION_DISTANCE) {
      openChest(id);
      addLog("Interacting with chest...", 'info');
      
      // Simulate blockchain delay
      const reward = await requestTokenRewardPlaceholder(id);
      
      incrementBalance(reward);
      addLog(`Chest opened! Received ${reward} (Placeholder) tokens.`, 'success');
      addLog("In a future version, this chest will grant real tokens.", 'warning');
    } else {
      addLog("Too far away! Move closer to open.", 'warning');
    }
  };

  return (
    <group position={position}>
      {/* Chest Base */}
      <mesh castShadow receiveShadow onClick={handleInteraction} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color={isOpen ? "#5c5c5c" : "#d97706"} />
      </mesh>
      
      {/* Chest Lid (Rotates if open) */}
      <mesh 
        castShadow 
        position={[0, 1, -0.5]} 
        rotation={[isOpen ? -Math.PI / 4 : 0, 0, 0]}
        origin={[0, 0, 0.5]} // Pivot hack handled via position logic usually, simplified here
      >
        <boxGeometry args={[1.5, 0.3, 1]} />
        <meshStandardMaterial color={isOpen ? "#4a4a4a" : "#f59e0b"} />
      </mesh>

      {/* Floating Label when closed */}
      {!isOpen && (
        <Html position={[0, 2, 0]} center distanceFactor={15}>
          <div className="bg-black/50 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
            Treasure
          </div>
        </Html>
      )}
    </group>
  );
};

export const ChestManager: React.FC = () => {
  const chests = useGameStore((state) => state.chests);
  const playerPosition = useGameStore((state) => state.playerPosition);

  return (
    <>
      {chests.map((chest) => (
        <Chest 
          key={chest.id} 
          {...chest} 
          playerPosition={playerPosition} 
        />
      ))}
    </>
  );
};