import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { DoubleSide } from 'three';

export const Terrain: React.FC = () => {
  const setPlayerTarget = useGameStore((state) => state.setPlayerTarget);

  const handleClick = (e: any) => {
    // Prevent click propagation if we clicked an object on top of terrain
    e.stopPropagation();
    
    // e.point is the Vector3 intersection point in world space
    const { x, y, z } = e.point;
    
    // Set target for player to move to. Keep y at 0 usually, but terrain is flat here.
    setPlayerTarget([x, 0, z]);
  };

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.1, 0]} 
      receiveShadow
      onClick={handleClick}
    >
      <planeGeometry args={[5000, 5000]} />
      <meshStandardMaterial 
        color="#3a5f40" 
        side={DoubleSide}
        roughness={1} 
      />
      <gridHelper args={[5000, 500, "#2d4a32", "#2d4a32"]} rotation={[-Math.PI / 2, 0, 0]} />
    </mesh>
  );
};