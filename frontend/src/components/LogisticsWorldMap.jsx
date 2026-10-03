import React, { useState } from 'react';
import { Globe, Plane, Radio, ShieldCheck, Activity } from 'lucide-react';

export function LogisticsWorldMap({ shipments = [], activeRoute = null, height = '340px' }) {
  const [hoveredHub, setHoveredHub] = useState(null);

  // Key Logistics Hubs Coordinates on SVG Map (500x260 viewport)
  const hubs = [
    { id: 'chennai', name: 'Chennai', x: 335, y: 135, code: 'MAA' },
    { id: 'bengaluru', name: 'Bengaluru', x: 328, y: 138, code: 'BLR' },
    { id: 'mumbai', name: 'Mumbai', x: 318, y: 125, code: 'BOM' },
    { id: 'delhi', name: 'Delhi', x: 322, y: 110, code: 'DEL' },
    { id: 'singapore', name: 'Singapore', x: 375, y: 155, code: 'SIN' },
    { id: 'dubai', name: 'Dubai', x: 285, y: 118, code: 'DXB' },
    { id: 'london', name: 'London', x: 215, y: 75, code: 'LHR' },
    { id: 'frankfurt', name: 'Frankfurt', x: 232, y: 78, code: 'FRA' },
    { id: 'tokyo', name: 'Tokyo', x: 425, y: 105, code: 'HND' },
    { id: 'los angeles', name: 'Los Angeles', x: 80, y: 105, code: 'LAX' },
    { id: 'new york', name: 'New York', x: 130, y: 92, code: 'JFK' },
    { id: 'sydney', name: 'Sydney', x: 440, y: 215, code: 'SYD' }
  ];

  // Derive active routes connecting hubs from real backend shipments
  const activeRoutes = (shipments.length > 0 ? shipments : [
    { source: 'Singapore', destination: 'Los Angeles', status: 'IN_TRANSIT', shipmentId: 'DEMO-1' },
    { source: 'Chennai', destination: 'Bengaluru', status: 'DELIVERED', shipmentId: 'DEMO-2' },
    { source: 'London', destination: 'Dubai', status: 'IN_TRANSIT', shipmentId: 'DEMO-3' },
    { source: 'Mumbai', destination: 'Delhi', status: 'CREATED', shipmentId: 'DEMO-4' }
  ]).slice(0, 6);

  const getHubCoords = (cityName) => {
    if (!cityName) return { x: 335, y: 135, name: 'Hub', code: 'HUB' };
    const lower = cityName.toLowerCase().trim();
    const found = hubs.find((h) => lower.includes(h.id) || h.id.includes(lower));
    if (found) return found;
    // Pseudo-position for arbitrary custom city names
    let hash = 0;
    for (let i = 0; i < lower.length; i++) hash = (hash << 5) - hash + lower.charCodeAt(i);
    const px = 100 + (Math.abs(hash) % 300);
    const py = 60 + (Math.abs(hash * 13) % 140);
    return { x: px, y: py, name: cityName, code: cityName.substring(0, 3).toUpperCase() };
  };

  return (
    <div style={{
      width: '100%',
      height,
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      background: 'linear-gradient(145deg, #0b1528 0%, #172554 60%, #1e1b4b 100%)',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 10px 25px -5px rgba(37, 99, 235, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      {/* SVG Interactive Map Canvas */}
      <svg
        viewBox="0 0 500 260"
        style={{ width: '100%', height: '100%', userSelect: 'none' }}
      >
        <defs>
          {/* Glowing Arc Gradient */}
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
          </linearGradient>

          {/* Continent Fill Gradient */}
          <linearGradient id="continentFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Subtle Latitude / Longitude Map Grid */}
        <g stroke="#334155" strokeWidth="0.4" strokeDasharray="2,4" opacity="0.4">
          <line x1="0" y1="65" x2="500" y2="65" />
          <line x1="0" y1="130" x2="500" y2="130" />
          <line x1="0" y1="195" x2="500" y2="195" />
          <line x1="125" y1="0" x2="125" y2="260" />
          <line x1="250" y1="0" x2="250" y2="260" />
          <line x1="375" y1="0" x2="375" y2="260" />
        </g>

        {/* Continents Outline Silhouette */}
        <g fill="url(#continentFill)" stroke="#38bdf8" strokeWidth="0.5" opacity="0.35">
          {/* North America */}
          <path d="M 50 60 Q 80 40 120 50 Q 150 70 130 110 Q 90 120 70 100 Z" />
          {/* South America */}
          <path d="M 120 130 Q 150 140 140 190 Q 120 220 110 180 Z" />
          {/* Europe */}
          <path d="M 200 50 Q 250 45 260 80 Q 230 95 205 85 Z" />
          {/* Africa */}
          <path d="M 210 100 Q 260 100 265 150 Q 240 195 220 150 Z" />
          {/* Asia */}
          <path d="M 270 45 Q 400 40 430 90 Q 380 140 310 120 Z" />
          {/* Australia */}
          <path d="M 400 170 Q 455 170 450 215 Q 405 220 400 185 Z" />
        </g>

        {/* Dynamic Curved Route Arcs */}
        {activeRoutes.map((r, idx) => {
          const src = getHubCoords(r.source);
          const dst = getHubCoords(r.destination);

          // Calculate Quadratic Bezier Curve Apex
          const midX = (src.x + dst.x) / 2;
          const midY = Math.min(src.y, dst.y) - Math.abs(src.x - dst.x) * 0.22;
          const pathData = `M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`;

          let strokeColor = 'url(#routeGlow)';
          if (r.status === 'DELIVERED') strokeColor = '#10b981';
          if (r.status === 'CANCELLED') strokeColor = '#f43f5e';

          return (
            <g key={r.shipmentId || idx}>
              {/* Glow Blur Path */}
              <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                opacity="0.25"
              />
              {/* Sharp Arc Line */}
              <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeDasharray={r.status === 'IN_TRANSIT' ? '4,3' : 'none'}
                opacity="0.85"
              />

              {/* Transit Flight Particle Beacon */}
              <circle cx={midX} cy={midY} r="3" fill="#38bdf8" filter="url(#glowEffect)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Logistics Hub Radar Nodes */}
        {hubs.map((hub) => (
          <g
            key={hub.id}
            transform={`translate(${hub.x}, ${hub.y})`}
            onMouseEnter={() => setHoveredHub(hub)}
            onMouseLeave={() => setHoveredHub(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Outer Radar Ripple */}
            <circle cx="0" cy="0" r="7" fill="none" stroke="#38bdf8" strokeWidth="0.75" opacity="0.5">
              <animate attributeName="r" values="3;9;3" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Hub Center Dot */}
            <circle cx="0" cy="0" r="3" fill="#38bdf8" />

            {/* City Label */}
            <text
              x="0"
              y="11"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="6"
              fontWeight="700"
              fontFamily="var(--font-sans)"
              letterSpacing="0.05em"
            >
              {hub.name}
            </text>
          </g>
        ))}

        {/* Hover Hub Tooltip */}
        {hoveredHub && (
          <g transform={`translate(${hoveredHub.x}, ${hoveredHub.y - 18})`}>
            <rect x="-35" y="-12" width="70" height="16" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
            <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
              {hoveredHub.name} ({hoveredHub.code})
            </text>
          </g>
        )}
      </svg>

      {/* Floating Top Telemetry Pill */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '9999px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#e2e8f0',
        fontSize: '0.6875rem',
        fontWeight: '700',
        letterSpacing: '0.04em'
      }}>
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#38bdf8',
          display: 'inline-block'
        }} className="pulse-dot" />
        <span>LIVE GLOBAL LOGISTICS CORRIDORS</span>
      </div>

      {/* Floating Bottom Active Corridor Tag */}
      {activeRoutes.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          fontSize: '0.6875rem'
        }}>
          <Plane style={{ width: '12px', height: '12px', color: '#38bdf8' }} />
          <span style={{ color: '#94a3b8' }}>Active Corridor:</span>
          <span style={{ fontWeight: '700', color: '#38bdf8' }}>
            {activeRoutes[0].source} → {activeRoutes[0].destination}
          </span>
        </div>
      )}

    </div>
  );
}
