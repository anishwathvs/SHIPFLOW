import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CargoBox({ weight = 3.0 }) {
  const boxRef = useRef();

  useFrame((_, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.y += delta * 0.4;
    }
  });

  // Calculate subtle scale based on package weight
  const baseScale = Math.min(Math.max(0.85 + (weight * 0.04), 0.9), 1.35);

  return (
    <group ref={boxRef} scale={[baseScale, baseScale, baseScale]}>
      {/* 1. Main Cardboard Box Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.2, 1.4]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Reinforced Package Sealing Tape */}
      <mesh position={[0, 0.605, 0]}>
        <boxGeometry args={[0.3, 0.01, 1.42]} />
        <meshStandardMaterial color="#92400e" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.605, 0]}>
        <boxGeometry args={[0.3, 0.01, 1.42]} />
        <meshStandardMaterial color="#92400e" roughness={0.4} />
      </mesh>

      {/* 3. Shipping Barcode Label on Side */}
      <mesh position={[0.755, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0.756, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* 4. SHIPFLOW Brand Badge */}
      <mesh position={[0, 0.1, 0.705]}>
        <planeGeometry args={[0.6, 0.35]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function CargoParcel3D({ weight = 3.0, height = '260px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [2.2, 1.8, 2.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
        <pointLight position={[-4, -3, -2]} intensity={0.5} color="#93c5fd" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <CargoBox weight={weight} />
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
