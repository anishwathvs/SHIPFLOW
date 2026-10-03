import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RouteArc } from './RouteArc';

// Mapping of common logistics hubs to latitude/longitude
const CITY_COORDS = {
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
  'new york': { lat: 40.7128, lng: -74.0060, name: 'New York' },
  boston: { lat: 42.3601, lng: -71.0589, name: 'Boston' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London' },
  paris: { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  berlin: { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
  'san francisco': { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
};

function getCityCoord(cityName) {
  if (!cityName) return { lat: 13.08, lng: 80.27, name: cityName || 'Unknown' };
  const lower = cityName.toLowerCase().trim();
  if (CITY_COORDS[lower]) return CITY_COORDS[lower];
  
  // Deterministic pseudo-location for any custom city name
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
  }
  const pseudoLat = ((Math.abs(hash) % 120) - 60);
  const pseudoLng = ((Math.abs(hash * 31) % 360) - 180);
  return { lat: pseudoLat, lng: pseudoLng, name: cityName };
}

function latLngToVector3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Inner 3D Globe Mesh with rotating wireframe and nodes
function GlobeScene({ shipments = [] }) {
  const globeGroupRef = useRef();

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Extract unique active hubs from shipments
  const activeCities = useMemo(() => {
    const map = new Map();
    shipments.forEach((s) => {
      if (s.source) {
        const c = getCityCoord(s.source);
        map.set(c.name, c);
      }
      if (s.destination) {
        const c = getCityCoord(s.destination);
        map.set(c.name, c);
      }
    });

    // Add default fallback hubs if empty
    if (map.size === 0) {
      map.set('Chennai', CITY_COORDS['chennai']);
      map.set('Bangalore', CITY_COORDS['bangalore']);
      map.set('Dubai', CITY_COORDS['dubai']);
      map.set('London', CITY_COORDS['london']);
      map.set('New York', CITY_COORDS['new york']);
      map.set('Singapore', CITY_COORDS['singapore']);
    }
    return Array.from(map.values());
  }, [shipments]);

  return (
    <group ref={globeGroupRef}>
      {/* Dark Inner Core Sphere */}
      <mesh>
        <sphereGeometry args={[1.98, 48, 48]} />
        <meshStandardMaterial
          color="#060911"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Outer Wireframe Latitude/Longitude Grid */}
      <mesh>
        <sphereGeometry args={[2.0, 32, 24]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Atmospheric Outer Halo */}
      <mesh>
        <sphereGeometry args={[2.12, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* City Nodes on Globe Surface */}
      {activeCities.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, 2.02);
        return (
          <group key={`${city.name}-${idx}`} position={pos}>
            <mesh>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color="#00e5ff" />
            </mesh>
            {/* Pulsing Outer Node Ring */}
            <mesh>
              <ringGeometry args={[0.05, 0.08, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Animated Route Arcs for Shipments */}
      {shipments.map((s, idx) => {
        const src = getCityCoord(s.source);
        const dest = getCityCoord(s.destination);

        let arcColor = '#00e5ff'; // Default Cyan
        if (s.status === 'DELIVERED') arcColor = '#10b981'; // Emerald
        if (s.status === 'CREATED') arcColor = '#f59e0b'; // Amber
        if (s.status === 'CANCELLED') arcColor = '#f43f5e'; // Rose

        return (
          <RouteArc
            key={s.shipmentId || idx}
            startLat={src.lat}
            startLng={src.lng}
            endLat={dest.lat}
            endLng={dest.lng}
            color={arcColor}
            active={s.status === 'IN_TRANSIT' || s.status === 'CREATED'}
            speed={1.2}
          />
        );
      })}
    </group>
  );
}

// 2D Vector Fallback if WebGL encounters issues
function FallbackLogisticsMap({ shipments = [] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-slate-900/60 rounded-2xl border border-cyan-500/20">
      <div className="w-16 h-16 mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="1.5" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Global Route Stream Active</h3>
      <p className="text-sm text-slate-400 max-w-md mb-4">
        Monitoring {shipments.length} active shipment routes across regional logistics corridors.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {shipments.slice(0, 4).map((s) => (
          <span key={s.shipmentId} className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
            {s.source} → {s.destination} ({s.status})
          </span>
        ))}
      </div>
    </div>
  );
}

export function LogisticsGlobe({ shipments = [] }) {
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    // Detect WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
      }
    } catch {
      setHasWebGLError(true);
    }
  }, []);

  if (hasWebGLError) {
    return <FallbackLogisticsMap shipments={shipments} />;
  }

  return (
    <div className="three-canvas-container" style={{ height: '100%', minHeight: '440px' }}>
      <Canvas
        camera={{ position: [0, 1.5, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />

        <GlobeScene shipments={shipments} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.8}
        />
      </Canvas>

      {/* Overlay HUD Tag */}
      <div className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D TELEMETRY • {shipments.length} ROUTES LOADED</span>
      </div>
    </div>
  );
}
