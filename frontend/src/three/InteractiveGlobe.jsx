import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Key Global Logistics Hubs
const CITY_COORDS = {
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
  singapore: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  dubai: { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  london: { lat: 51.5074, lng: -0.1278, name: 'London' },
  frankfurt: { lat: 50.1109, lng: 8.6821, name: 'Frankfurt' },
  tokyo: { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  'new york': { lat: 40.7128, lng: -74.0060, name: 'New York' },
  'los angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney' }
};

export function getCityCoord(cityName) {
  if (!cityName) return { lat: 13.08, lng: 80.27, name: cityName || 'Hub' };
  const lower = cityName.toLowerCase().trim();
  if (CITY_COORDS[lower]) return CITY_COORDS[lower];
  
  // Deterministic fallback for custom route locations
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
  }
  const pseudoLat = ((Math.abs(hash) % 110) - 50);
  const pseudoLng = ((Math.abs(hash * 37) % 360) - 180);
  return { lat: pseudoLat, lng: pseudoLng, name: cityName };
}

export function latLngToVector3(lat, lng, radius = 2.0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// 3D Animated Route Arc between two coordinates
function GlobeRouteArc({ start, end, color = '#2563eb', active = true }) {
  const particleRef = useRef();

  const { curve, points } = useMemo(() => {
    const vStart = latLngToVector3(start.lat, start.lng, 2.02);
    const vEnd = latLngToVector3(end.lat, end.lng, 2.02);

    // Calculate arc apex based on distance
    const dist = vStart.distanceTo(vEnd);
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
    const altitude = Math.min(Math.max(dist * 0.45, 0.4), 1.2);
    const vMid = mid.normalize().multiplyScalar(2.0 + altitude);

    const c = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);
    return { curve: c, points: c.getPoints(50) };
  }, [start, end]);

  const lineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame((state) => {
    if (particleRef.current && active) {
      const t = (state.clock.getElapsedTime() * 0.35) % 1;
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Route Spline Line */}
      <line geometry={lineGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.65} linewidth={2} />
      </line>

      {/* Moving Parcel / Flight Pulse along Arc */}
      {active && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}

// Globe Scene Geometry & Lighting
function GlobeCore({ shipments = [], selectedShipmentId = null, onSelectShipment }) {
  const globeRef = useRef();
  const atmosphereRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
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

    // Default global demo hubs if no shipments loaded yet
    if (map.size === 0) {
      map.set('Chennai', CITY_COORDS['chennai']);
      map.set('Bengaluru', CITY_COORDS['bengaluru']);
      map.set('Singapore', CITY_COORDS['singapore']);
      map.set('Dubai', CITY_COORDS['dubai']);
      map.set('London', CITY_COORDS['london']);
      map.set('New York', CITY_COORDS['new york']);
    }
    return Array.from(map.values());
  }, [shipments]);

  return (
    <group ref={globeRef}>
      {/* 1. Core Sphere (Pure Light Minimalist Ocean) */}
      <mesh>
        <sphereGeometry args={[1.98, 64, 64]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Continents / Wireframe Lat-Lng Grid (Subtle Royal Blue) */}
      <mesh>
        <sphereGeometry args={[2.0, 36, 24]} />
        <meshBasicMaterial
          color="#2563eb"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* 3. Outer Atmosphere Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.14, 48, 48]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 4. Active Hub Nodes & City Tooltips */}
      {activeCities.map((city, idx) => {
        const pos = latLngToVector3(city.lat, city.lng, 2.03);
        return (
          <group key={`${city.name}-${idx}`} position={pos}>
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial color="#2563eb" />
            </mesh>
            <mesh>
              <ringGeometry args={[0.06, 0.09, 16]} />
              <meshBasicMaterial color="#6366f1" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* 5. Active Shipment Route Arcs */}
      {shipments.map((s, idx) => {
        const src = getCityCoord(s.source);
        const dest = getCityCoord(s.destination);
        const isSelected = selectedShipmentId && s.shipmentId === selectedShipmentId;

        let arcColor = '#2563eb';
        if (s.status === 'DELIVERED') arcColor = '#10b981';
        if (s.status === 'IN_TRANSIT') arcColor = '#6366f1';
        if (s.status === 'CANCELLED') arcColor = '#ef4444';
        if (isSelected) arcColor = '#0284c7';

        return (
          <GlobeRouteArc
            key={s.shipmentId || idx}
            start={src}
            end={dest}
            color={arcColor}
            active={s.status === 'IN_TRANSIT' || isSelected}
          />
        );
      })}
    </group>
  );
}

export function InteractiveGlobe({ shipments = [], selectedShipmentId = null, onSelectShipment, interactive = true, height = '480px' }) {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 1.2, 4.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={0.8} color="#93c5fd" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#c7d2fe" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <GlobeCore
            shipments={shipments}
            selectedShipmentId={selectedShipmentId}
            onSelectShipment={onSelectShipment}
          />
        </Float>

        <OrbitControls
          enableZoom={interactive}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
          minDistance={3.5}
          maxDistance={6.0}
        />
      </Canvas>

      {/* Floating Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#334155'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          display: 'inline-block'
        }} className="pulse-node" />
        <span>LIVE 3D GLOBAL TELEMETRY</span>
      </div>
    </div>
  );
}
