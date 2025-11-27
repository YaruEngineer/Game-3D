import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { Terrain } from './Terrain';
import { Player } from './Player';
import { ChestManager } from './ChestManager';
import { Environment } from './Environment';

export const Scene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [50, 50, 50], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 2]} // Handle high DPI screens
    >
      {/* Lighting */}
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight 
        position={[100, 200, 50]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Background & Atmosphere */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#d0e7ff', 20, 150]} />

      <Suspense fallback={null}>
        <Environment />
        <Terrain />
        <ChestManager />
        <Player />
      </Suspense>
    </Canvas>
  );
};