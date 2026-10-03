import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CargoBox({ weight = 1 }) {
  const meshRef = useRef();

  // Calculate dynamic scale based on weight (smooth clamp between 0.8 and 1.7)
  const scaleFactor = Math.min(Math.max(0.75 + Math.log10(Math.max(weight, 0.5) + 1) * 0.6, 0.7), 1.6);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <group ref={meshRef} scale={[scaleFactor, scaleFactor, scaleFactor]}>
        {/* Main Cargo Box Cube */}
        <mesh>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.7}
            roughness={0.2}
            emissive="#0284c7"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Outer Glowing Wireframe Cage */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.42, 1.42, 1.42)]} />
          <lineBasicMaterial color="#00e5ff" linewidth={2} />
        </lineSegments>

        {/* Cargo Straps / Accent Details */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.44, 0.2, 1.44]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

export function CargoModel({ weight = 1, cost = 50 }) {
  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950/80 border border-cyan-500/20 flex items-center justify-center">
      <Canvas camera={{ position: [0, 1.2, 3.2], fov: 40 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00e5ff" />
        <pointLight position={[-3, -3, -3]} intensity={1} color="#a855f7" />

        <CargoBox weight={weight} />
      </Canvas>

      {/* Floating Readout Telemetry */}
      <div className="absolute top-2 left-3 text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
        3D CARGO TELEMETRY
      </div>

      <div className="absolute bottom-2 right-3 text-right bg-slate-900/85 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
        <div className="text-[10px] text-slate-400 font-mono">ESTIMATED COST</div>
        <div className="text-sm font-bold text-cyan-300 font-mono">₹{Number(cost).toFixed(2)}</div>
      </div>
    </div>
  );
}
