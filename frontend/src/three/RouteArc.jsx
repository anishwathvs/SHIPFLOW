import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Renders an animated great-circle 3D arc between two spherical coordinates
 * with a trailing light photon particle.
 */
export function RouteArc({ startLat, startLng, endLat, endLng, color = '#00e5ff', active = true, speed = 1 }) {
  const particleRef = useRef();

  // Convert lat/lng on unit sphere to 3D Cartesian coordinates
  const { curve, points } = useMemo(() => {
    const radius = 2.0;
    
    function latLngToVector3(lat, lng, r) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    const v1 = latLngToVector3(startLat, startLng, radius);
    const v2 = latLngToVector3(endLat, endLng, radius);

    // Calculate elevated midpoint for 3D trajectory
    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const distance = v1.distanceTo(v2);
    // Raise arc height proportional to distance
    const elevation = radius + Math.min(distance * 0.45, 1.2);
    mid.normalize().multiplyScalar(elevation);

    const cubicCurve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    const pts = cubicCurve.getPoints(50);
    return { curve: cubicCurve, points: pts };
  }, [startLat, startLng, endLat, endLng]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  // Animate pulse particle along the arc
  useFrame(({ clock }) => {
    if (particleRef.current && active) {
      const t = (clock.getElapsedTime() * 0.35 * speed) % 1;
      const position = curve.getPoint(t);
      particleRef.current.position.copy(position);
    }
  });

  return (
    <group>
      {/* 3D Arc Line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.75 : 0.25}
          linewidth={2}
        />
      </line>

      {/* Travelling Photon Particle */}
      {active && (
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}
