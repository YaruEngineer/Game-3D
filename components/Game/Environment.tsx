import React, { useMemo } from 'react';
import { Instance, Instances } from '@react-three/drei';

export const Environment: React.FC = () => {
  // Procedurally generate trees
  const treeData = useMemo(() => {
    const items = [];
    // Generate 300 trees spread over 400x400 area
    for (let i = 0; i < 300; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 400,
          0,
          (Math.random() - 0.5) * 400
        ] as [number, number, number],
        scale: 0.8 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Simple Geometric Trees using Instances for performance */}
      <Instances range={300}>
        <coneGeometry args={[1.5, 4, 8]} />
        <meshStandardMaterial color="#1e3a1e" />
        {treeData.map((data, i) => (
          <group key={i} position={data.position} rotation={[0, data.rotation, 0]} scale={[data.scale, data.scale, data.scale]}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]}>
               <cylinderGeometry args={[0.3, 0.5, 2]} />
               <meshStandardMaterial color="#3e2723" />
            </mesh>
            {/* Leaves Instance */}
            <Instance position={[0, 3, 0]} />
          </group>
        ))}
      </Instances>

      {/* Scattered Rocks */}
      {Array.from({ length: 50 }).map((_, i) => (
         <mesh 
            key={`rock-${i}`}
            position={[(Math.random() - 0.5) * 300, 0.3, (Math.random() - 0.5) * 300]}
            rotation={[Math.random(), Math.random(), Math.random()]}
            castShadow
            receiveShadow
         >
            <dodecahedronGeometry args={[0.6 + Math.random(), 0]} />
            <meshStandardMaterial color="#78909c" />
         </mesh>
      ))}
    </group>
  );
};