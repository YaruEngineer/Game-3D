import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { useGameStore } from '../../store/gameStore';

const PLAYER_SPEED = 15;

export const Player: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const target = useGameStore((state) => state.playerTarget);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const { camera } = useThree();

  // Camera offset relative to player (Isometric angle)
  const offset = new Vector3(40, 40, 40);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Movement Logic
    if (target) {
      const currentPos = meshRef.current.position;
      const targetVec = new Vector3(target[0], 0.5, target[2]); // Height correction
      
      const distance = currentPos.distanceTo(targetVec);

      if (distance > 0.5) {
        // Calculate direction
        const direction = new Vector3()
          .subVectors(targetVec, currentPos)
          .normalize();
        
        // Move towards target
        const moveDistance = PLAYER_SPEED * delta;
        
        // Don't overshoot
        const actualMove = Math.min(moveDistance, distance);
        
        meshRef.current.position.add(direction.multiplyScalar(actualMove));
        
        // Rotate player to face direction
        meshRef.current.lookAt(targetVec);
      }
    }

    // Update global store with current position (for minimap or chest logic)
    setPlayerPosition([
      meshRef.current.position.x,
      meshRef.current.position.y,
      meshRef.current.position.z
    ]);

    // Camera Follow Logic
    const desiredCameraPos = meshRef.current.position.clone().add(offset);
    camera.position.lerp(desiredCameraPos, 0.1); // Smooth follow
    camera.lookAt(meshRef.current.position);
  });

  return (
    <group ref={meshRef} position={[0, 1, 0]}>
      {/* Simple Capsule Representation of Player */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* Player Decal/Shadow base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};