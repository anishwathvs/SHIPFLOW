import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Crosshair, 
  Navigation, 
  Layers, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  Package, 
  Radio, 
  Plus, 
  Maximize2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';

// Curated Geocoding Dictionary for Domestic & Global Logistics Hubs
const CITY_COORDINATES = {
  // Indian Logistics Hubs
  'chennai': { lat: 13.0827, lng: 80.2707, label: 'Chennai Hub' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, label: 'Bengaluru Tech Hub' },
  'bangalore': { lat: 12.9716, lng: 77.5946, label: 'Bengaluru Tech Hub' },
  'mumbai': { lat: 19.0760, lng: 72.8777, label: 'Mumbai Port' },
  'mumbai port': { lat: 18.9438, lng: 72.8465, label: 'Mumbai Port' },
  'delhi': { lat: 28.6139, lng: 77.2090, label: 'Delhi Central' },
  'delhi hub': { lat: 28.5562, lng: 77.1000, label: 'Delhi Central' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, label: 'Hyderabad Hub' },
  'kolkata': { lat: 22.5726, lng: 88.3639, label: 'Kolkata Port' },
  'pune': { lat: 18.5204, lng: 73.8567, label: 'Pune Logistics' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, label: 'Ahmedabad Node' },
  'kochi': { lat: 9.9312, lng: 76.2673, label: 'Kochi Port' },
  'jaipur': { lat: 26.9124, lng: 75.7873, label: 'Jaipur Depot' },
  'goa': { lat: 15.2993, lng: 74.1240, label: 'Goa Coastal Hub' },

  // International Hubs
  'singapore': { lat: 1.3521, lng: 103.8198, label: 'Singapore Port' },
  'sin': { lat: 1.3644, lng: 103.9915, label: 'Singapore Changi' },
  'los angeles': { lat: 34.0522, lng: -118.2437, label: 'Los Angeles Hub' },
  'lax': { lat: 33.9416, lng: -118.4085, label: 'Los Angeles Air Hub' },
  'new york': { lat: 40.7128, lng: -74.0060, label: 'New York Port' },
  'jfk': { lat: 40.6413, lng: -73.7781, label: 'New York JFK' },
  'london': { lat: 51.5074, lng: -0.1278, label: 'London Gateway' },
  'lhr': { lat: 51.4700, lng: -0.4543, label: 'London Heathrow' },
  'tokyo': { lat: 35.6762, lng: 139.6503, label: 'Tokyo Narita' },
  'nrt': { lat: 35.7720, lng: 140.3929, label: 'Tokyo Narita' },
  'dubai': { lat: 25.2048, lng: 55.2708, label: 'Dubai Logistics City' },
  'dxb': { lat: 25.2532, lng: 55.3657, label: 'Dubai Cargo' },
  'sydney': { lat: -33.8688, lng: 151.2093, label: 'Sydney Port' },
  'syd': { lat: -33.9399, lng: 151.1753, label: 'Sydney Kingsford' },
  'frankfurt': { lat: 50.1109, lng: 8.6821, label: 'Frankfurt Hub' },
  'fra': { lat: 50.0379, lng: 8.5622, label: 'Frankfurt Cargo' },
  'paris': { lat: 48.8566, lng: 2.3522, label: 'Paris CDG' },
  'cdg': { lat: 49.0097, lng: 2.5479, label: 'Paris CDG' },
  'hong kong': { lat: 22.3193, lng: 114.1694, label: 'Hong Kong Port' },
  'shanghai': { lat: 31.2304, lng: 121.4737, label: 'Shanghai Pudong' },
  'san francisco': { lat: 37.7749, lng: -122.4194, label: 'San Francisco Hub' },
  'chicago': { lat: 41.8781, lng: -87.6298, label: 'Chicago O\'Hare' },
  'toronto': { lat: 43.6532, lng: -79.3832, label: 'Toronto Logistics' },
  'dallas': { lat: 32.7767, lng: -96.7970, label: 'Dallas-Fort Worth' },
  'miami': { lat: 25.7617, lng: -80.1918, label: 'Miami Gateway' }
};

function getCityCoords(cityName) {
  if (!cityName) return null;
  const clean = cityName.trim().toLowerCase();
  
  if (CITY_COORDINATES[clean]) {
    return CITY_COORDINATES[clean];
  }
  
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }

  // Deterministic fallback based on city string hash
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const lat = 10 + (Math.abs(hash) % 40);
  const lng = 65 + (Math.abs(hash >> 3) % 65);
  return { lat, lng, label: cityName };
}

// Convert geographic lat/lng to SVG 1000x500 coordinates
function projectLatLng(lat, lng) {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

const STATUS_COLORS = {
  'CREATED': '#2563eb',    // Blue
  'IN_TRANSIT': '#f59e0b',  // Orange / Amber
  'DELIVERED': '#10b981',   // Green
  'CANCELLED': '#ef4444'    // Red
};

// Subtle Demo Corridors when database has zero shipments
const DEMO_CORRIDORS = [
  {
    shipmentId: 'DEMO-SIN-TYO',
    source: 'Singapore',
    destination: 'Tokyo',
    status: 'IN_TRANSIT',
    senderName: 'Apex Electronics',
    receiverName: 'Tokyo Tech Corp',
    weight: 4.5,
    cost: 120.0,
    packageDescription: 'Demo: Microchip Components'
  },
  {
    shipmentId: 'DEMO-BOM-DXB',
    source: 'Mumbai',
    destination: 'Dubai',
    status: 'CREATED',
    senderName: 'Bharat Export Ltd',
    receiverName: 'Gulf Retail LLC',
    weight: 2.0,
    cost: 70.0,
    packageDescription: 'Demo: Textile Consignment'
  },
  {
    shipmentId: 'DEMO-LHR-JFK',
    source: 'London',
    destination: 'New York',
    status: 'DELIVERED',
    senderName: 'Atlantic Freight',
    receiverName: 'Hudson Logistics',
    weight: 8.0,
    cost: 175.0,
    packageDescription: 'Demo: Precision Equipment'
  }
];

export function GlobalMapPage({ shipments = [], stats, activePage, onNavigate, onSelectShipment }) {
  const svgRef = useRef(null);
  const isDemo = shipments.length === 0;
  const displayShipments = isDemo ? DEMO_CORRIDORS : shipments;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [hoveredShipment, setHoveredShipment] = useState(null);

  // Pan and Zoom State
  const [viewState, setViewState] = useState({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return displayShipments.filter((s) => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q ||
        s.shipmentId?.toLowerCase().includes(q) ||
        s.senderName?.toLowerCase().includes(q) ||
        s.receiverName?.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q) ||
        s.destination?.toLowerCase().includes(q) ||
        s.packageDescription?.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [displayShipments, statusFilter, searchQuery]);

  // Compute curved paths for shipments
  const mappedRoutes = useMemo(() => {
    return filteredShipments.map((s) => {
      const srcCoord = getCityCoords(s.source);
      const destCoord = getCityCoords(s.destination);

      if (!srcCoord || !destCoord) return null;

      const p1 = projectLatLng(srcCoord.lat, srcCoord.lng);
      const p2 = projectLatLng(destCoord.lat, destCoord.lng);

      // Calculate control point for arch curve
      const midX = (p1.x + p2.x) / 2;
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const archHeight = Math.min(80, Math.max(30, dist * 0.28));
      const midY = (p1.y + p2.y) / 2 - archHeight;

      const pathData = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

      return {
        shipment: s,
        p1,
        p2,
        midX,
        midY,
        pathData,
        srcLabel: srcCoord.label || s.source,
        destLabel: destCoord.label || s.destination
      };
    }).filter(Boolean);
  }, [filteredShipments]);

  // Zoom controls
  const handleZoomIn = () => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.35, 3.5)
    }));
  };

  const handleZoomOut = () => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.35, 0.8)
    }));
  };

  const handleResetCenter = () => {
    setViewState({ zoom: 1, panX: 0, panY: 0 });
    setSelectedShipment(null);
  };

  const handleFitShipments = () => {
    if (mappedRoutes.length === 0) {
      handleResetCenter();
      return;
    }
    // Calculate bounding box of routes
    let minX = 1000, maxX = 0, minY = 500, maxY = 0;
    mappedRoutes.forEach((r) => {
      minX = Math.min(minX, r.p1.x, r.p2.x);
      maxX = Math.max(maxX, r.p1.x, r.p2.x);
      minY = Math.min(minY, r.p1.y, r.p2.y, r.midY);
      maxY = Math.max(maxY, r.p1.y, r.p2.y);
    });

    const boxWidth = maxX - minX || 200;
    const boxHeight = maxY - minY || 150;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const scaleX = 900 / (boxWidth + 80);
    const scaleY = 450 / (boxHeight + 80);
    const targetZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 1.1), 2.8);

    const panX = (500 - centerX) * targetZoom;
    const panY = (250 - centerY) * targetZoom;

    setViewState({ zoom: targetZoom, panX, panY });
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - viewState.panX, y: e.clientY - viewState.panY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setViewState((prev) => ({
      ...prev,
      panX: e.clientX - dragStartRef.current.x,
      panY: e.clientY - dragStartRef.current.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom * zoomFactor, 0.8), 3.5)
    }));
  };

  // Major global hubs to display permanently on radar
  const permanentHubs = useMemo(() => {
    return [
      { name: 'Delhi', ...projectLatLng(28.61, 77.20) },
      { name: 'Mumbai', ...projectLatLng(19.07, 72.87) },
      { name: 'Chennai', ...projectLatLng(13.08, 80.27) },
      { name: 'Bengaluru', ...projectLatLng(12.97, 77.59) },
      { name: 'Kolkata', ...projectLatLng(22.57, 88.36) },
      { name: 'Singapore', ...projectLatLng(1.35, 103.81) },
      { name: 'Dubai', ...projectLatLng(25.20, 55.27) },
      { name: 'Tokyo', ...projectLatLng(35.67, 139.65) },
      { name: 'London', ...projectLatLng(51.50, -0.12) },
      { name: 'Frankfurt', ...projectLatLng(50.11, 8.68) },
      { name: 'New York', ...projectLatLng(40.71, -74.00) },
      { name: 'Los Angeles', ...projectLatLng(34.05, -118.24) },
      { name: 'Sydney', ...projectLatLng(-33.86, 151.20) }
    ];
  }, []);

  return (
    <div className="page-layout-sidebar">
      
      {/* Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Map Viewport Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe style={{ width: '28px', height: '28px', color: 'var(--primary-blue)' }} />
              <span>Global Shipment Map</span>
            </h1>
            <p className="page-subtitle">
              Interactive logistics telemetry for shipment routes, cargo corridors, and operational hubs.
            </p>
          </div>

          {/* Demo Corridor Notification Badge */}
          {isDemo && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '9999px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <Sparkles style={{ width: '14px', height: '14px', color: '#2563eb' }} />
              <span>DEMO VISUALIZATION: Background Corridors</span>
            </div>
          )}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="map-toolbar-card">
          <div className="map-search-box">
            <Search style={{ width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search shipment ID, city, sender, receiver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="map-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="map-filter-group">
            {['ALL', 'CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`map-filter-pill ${statusFilter === st ? 'active' : ''}`}
              >
                {st === 'ALL' ? 'All Corridors' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================================
            LARGE INTERACTIVE CUSTOM SVG LOGISTICS MAP
            Occupies ~70% of viewport with zero external API key requirements.
            ===================================================================== */}
        <div className="map-wrapper-panel" style={{ height: '620px' }}>
          
          <svg
            ref={svgRef}
            className="custom-logistics-svg-map"
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid slice"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              {/* Radial and Linear Gradients */}
              <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#101c38" />
                <stop offset="100%" stopColor="#070c18" />
              </radialGradient>

              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Ocean Background */}
            <rect width="1000" height="500" fill="url(#oceanGlow)" />

            {/* Transform Group for Pan and Zoom */}
            <g transform={`translate(${viewState.panX}, ${viewState.panY}) scale(${viewState.zoom})`}>
              
              {/* Subtle Latitude & Longitude Grid Lines */}
              <g stroke="#1a2b4c" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.6">
                <line x1="0" y1="83" x2="1000" y2="83" />
                <line x1="0" y1="166" x2="1000" y2="166" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#2563eb" strokeWidth="0.8" opacity="0.8" /> {/* Equator */}
                <line x1="0" y1="333" x2="1000" y2="333" />
                <line x1="0" y1="416" x2="1000" y2="416" />

                <line x1="166" y1="0" x2="166" y2="500" />
                <line x1="333" y1="0" x2="333" y2="500" />
                <line x1="500" y1="0" x2="500" y2="500" stroke="#2563eb" strokeWidth="0.8" opacity="0.8" /> {/* Prime Meridian */}
                <line x1="666" y1="0" x2="666" y2="500" />
                <line x1="833" y1="0" x2="833" y2="500" />
              </g>

              {/* ===============================================================
                  RECOGNIZABLE WORLD CONTINENTS (Clean Vector Shapes)
                  =============================================================== */}
              <g fill="#162238" stroke="#24385a" strokeWidth="0.8">
                
                {/* North America & Greenland */}
                <path d="M 120 70 L 150 60 L 210 65 L 260 90 L 290 120 L 295 150 L 260 170 L 220 180 L 205 210 L 180 230 L 160 210 L 130 170 L 110 130 L 105 85 Z" />
                <path d="M 280 40 L 320 30 L 350 45 L 340 70 L 300 75 Z" /> {/* Greenland */}
                
                {/* South America */}
                <path d="M 270 240 L 310 245 L 340 280 L 350 320 L 320 380 L 290 430 L 270 410 L 265 340 L 250 270 Z" />
                
                {/* Europe */}
                <path d="M 460 100 L 490 85 L 530 80 L 560 95 L 550 140 L 510 160 L 470 155 L 450 135 L 455 110 Z" />
                <path d="M 480 95 L 495 90 L 490 115 L 475 110 Z" /> {/* UK */}
                <path d="M 520 50 L 540 45 L 550 85 L 530 90 Z" /> {/* Scandinavia */}

                {/* Africa & Madagascar */}
                <path d="M 460 175 L 530 170 L 580 210 L 585 260 L 560 320 L 530 370 L 490 350 L 470 290 L 440 240 L 445 200 Z" />
                <path d="M 590 310 L 600 315 L 595 345 L 585 340 Z" /> {/* Madagascar */}

                {/* Asia & Russia */}
                <path d="M 570 85 L 680 70 L 780 75 L 870 95 L 890 140 L 850 170 L 790 200 L 750 230 L 710 210 L 680 180 L 620 175 L 570 140 Z" />
                <path d="M 685 175 L 740 175 L 735 240 L 710 250 L 690 220 Z" /> {/* Indian Subcontinent */}
                <path d="M 760 235 L 795 245 L 785 285 L 760 270 Z" /> {/* Southeast Asia */}
                <path d="M 875 135 L 895 145 L 885 185 L 870 175 Z" /> {/* Japan */}

                {/* Australia & New Zealand */}
                <path d="M 830 310 L 910 305 L 940 345 L 915 395 L 850 390 L 820 350 Z" />
                <path d="M 950 390 L 965 395 L 955 425 L 945 420 Z" /> {/* New Zealand */}
              </g>

              {/* Major Permanent Logistics Hubs on World Radar */}
              <g>
                {permanentHubs.map((hub) => (
                  <g key={hub.name} transform={`translate(${hub.x}, ${hub.y})`}>
                    <circle r="2" fill="#60a5fa" opacity="0.6" />
                    <text
                      y="-5"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="7"
                      fontFamily="var(--font-mono)"
                      fontWeight="600"
                      opacity="0.75"
                    >
                      {hub.name}
                    </text>
                  </g>
                ))}
              </g>

              {/* ===============================================================
                  SHIPMENT CORRIDOR FLIGHT ROUTES (Curved Paths)
                  =============================================================== */}
              <g>
                {mappedRoutes.map(({ shipment, p1, p2, midX, midY, pathData, srcLabel, destLabel }) => {
                  const isSelected = selectedShipment?.shipmentId === shipment.shipmentId;
                  const isHovered = hoveredShipment?.shipmentId === shipment.shipmentId;
                  const color = STATUS_COLORS[shipment.status] || '#2563eb';
                  const isTransit = shipment.status === 'IN_TRANSIT';

                  return (
                    <g 
                      key={shipment.shipmentId}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedShipment(shipment)}
                      onMouseEnter={() => setHoveredShipment(shipment)}
                      onMouseLeave={() => setHoveredShipment(null)}
                    >
                      {/* Wider Invisible Hit Target for easy clicking */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="18"
                      />

                      {/* Route Path Shadow */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth={isSelected || isHovered ? "5" : "3"}
                        opacity={isSelected || isHovered ? "0.4" : "0.15"}
                        filter="url(#glowEffect)"
                      />

                      {/* Main Dynamic Route Arc */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth={isSelected || isHovered ? "3.5" : "2"}
                        strokeDasharray={shipment.status === 'CANCELLED' ? "4 4" : undefined}
                        className={isTransit ? 'route-path-transit-animated' : ''}
                        opacity={shipment.status === 'CANCELLED' ? 0.4 : (isSelected || isHovered ? 1 : 0.85)}
                      />

                      {/* Origin Hub Node */}
                      <g transform={`translate(${p1.x}, ${p1.y})`}>
                        <circle r="4" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                        {(isSelected || isHovered || isTransit) && (
                          <circle r="8" fill="none" stroke={color} strokeWidth="1" className="radar-pulse-ring" />
                        )}
                      </g>

                      {/* Destination Hub Node */}
                      <g transform={`translate(${p2.x}, ${p2.y})`}>
                        <circle r="4" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                        <rect x="-3" y="-3" width="6" height="6" fill="#ffffff" />
                      </g>

                      {/* Corridor Label at Apex of Arc */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-36"
                          y="-16"
                          width="72"
                          height="14"
                          rx="4"
                          fill="rgba(11, 19, 40, 0.85)"
                          stroke={color}
                          strokeWidth="0.8"
                        />
                        <text
                          y="-6"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="7"
                          fontFamily="var(--font-mono)"
                          fontWeight="700"
                        >
                          {shipment.shipmentId}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

            </g>
          </svg>

          {/* Floating Telemetry HUD (Top Left) */}
          <div className="map-floating-hud">
            <div className="hud-title">
              <Radio style={{ width: '13px', height: '13px', color: 'var(--primary-blue)' }} />
              <span>GLOBAL TELEMETRY</span>
            </div>

            <div className="hud-metric-row">
              <span className="hud-metric-label">Total Shipments:</span>
              <span className="hud-metric-value">{stats?.total ?? shipments.length}</span>
            </div>
            <div className="hud-metric-row">
              <span className="hud-metric-label">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CREATED }} /> Created:
              </span>
              <span className="hud-metric-value" style={{ color: STATUS_COLORS.CREATED }}>
                {stats?.created ?? shipments.filter(s => s.status === 'CREATED').length}
              </span>
            </div>
            <div className="hud-metric-row">
              <span className="hud-metric-label">
                <span className="legend-dot" style={{ background: STATUS_COLORS.IN_TRANSIT }} /> In Transit:
              </span>
              <span className="hud-metric-value" style={{ color: STATUS_COLORS.IN_TRANSIT }}>
                {stats?.inTransit ?? shipments.filter(s => s.status === 'IN_TRANSIT').length}
              </span>
            </div>
            <div className="hud-metric-row">
              <span className="hud-metric-label">
                <span className="legend-dot" style={{ background: STATUS_COLORS.DELIVERED }} /> Delivered:
              </span>
              <span className="hud-metric-value" style={{ color: STATUS_COLORS.DELIVERED }}>
                {stats?.delivered ?? shipments.filter(s => s.status === 'DELIVERED').length}
              </span>
            </div>
            <div className="hud-metric-row">
              <span className="hud-metric-label">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CANCELLED }} /> Cancelled:
              </span>
              <span className="hud-metric-value" style={{ color: STATUS_COLORS.CANCELLED }}>
                {stats?.cancelled ?? shipments.filter(s => s.status === 'CANCELLED').length}
              </span>
            </div>
          </div>

          {/* Floating Map Legend (Bottom Left) */}
          <div className="map-floating-legend">
            <div className="legend-header">Status Legend</div>
            <div className="legend-items-list">
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CREATED }} />
                <span>Blue — Created</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.IN_TRANSIT }} />
                <span>Amber — In Transit</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.DELIVERED }} />
                <span>Green — Delivered</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CANCELLED }} />
                <span>Red — Cancelled</span>
              </div>
            </div>
          </div>

          {/* Custom Floating Zoom & Pan Controls (Bottom Right) */}
          <div className="map-floating-controls">
            <button onClick={handleZoomIn} className="map-ctrl-btn" title="Zoom In">+</button>
            <button onClick={handleZoomOut} className="map-ctrl-btn" title="Zoom Out">-</button>
            <button onClick={handleResetCenter} className="map-ctrl-btn" title="Reset View">
              <Crosshair style={{ width: '16px', height: '16px' }} />
            </button>
            <button onClick={handleFitShipments} className="map-ctrl-btn" title="Fit All Shipments">
              <Maximize2 style={{ width: '15px', height: '15px' }} />
            </button>
          </div>

          {/* Selected Shipment Spotlight Popup Modal (Top Right) */}
          {selectedShipment && (
            <div className="map-selected-spotlight">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  {selectedShipment.shipmentId}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: '800', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    background: `${STATUS_COLORS[selectedShipment.status]}15`,
                    color: STATUS_COLORS[selectedShipment.status],
                    border: `1px solid ${STATUS_COLORS[selectedShipment.status]}40`
                  }}
                >
                  {selectedShipment.status}
                </span>
              </div>

              <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                {selectedShipment.source} &rarr; {selectedShipment.destination}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                <div><strong>Sender:</strong> {selectedShipment.senderName || selectedShipment.sender}</div>
                <div><strong>Receiver:</strong> {selectedShipment.receiverName || selectedShipment.receiver}</div>
                {selectedShipment.packageDescription && (
                  <div><strong>Package:</strong> {selectedShipment.packageDescription}</div>
                )}
                <div><strong>Weight &amp; Cost:</strong> {Number(selectedShipment.weight || 0).toFixed(1)} kg • ${Number(selectedShipment.cost || 0).toFixed(2)}</div>
                {selectedShipment.updatedAt && (
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    Updated: {new Date(selectedShipment.updatedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectShipment(selectedShipment)}
                className="btn-primary"
                style={{ width: '100%', padding: '8px 14px', fontSize: '0.8125rem' }}
              >
                <span>View Shipment Details</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}

        </div>

        {/* =====================================================================
            LOWER OPERATIONAL SUMMARY: ACTIVE CORRIDORS
            ===================================================================== */}
        <div className="card-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Active Transit Corridors
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isDemo 
                  ? 'Demonstration corridors shown while database has zero records.' 
                  : `Currently active logistics channels (${filteredShipments.length} consignments).`}
              </p>
            </div>

            <button
              onClick={() => onNavigate('create')}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span>New Shipment</span>
            </button>
          </div>

          {filteredShipments.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center' }}>
              <Package style={{ width: '32px', height: '32px', color: '#94a3b8', margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>No matching active corridors found</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Try adjusting your search query or filter selection.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {filteredShipments.map((s) => (
                <div 
                  key={s.shipmentId}
                  onClick={() => {
                    setSelectedShipment(s);
                    handleFitShipments();
                  }}
                  className="map-corridor-card"
                  style={{
                    borderLeft: `4px solid ${STATUS_COLORS[s.status] || '#2563eb'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {s.shipmentId}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.6875rem', 
                        fontWeight: '800', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        background: `${STATUS_COLORS[s.status]}15`,
                        color: STATUS_COLORS[s.status]
                      }}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {s.source} &rarr; {s.destination}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{Number(s.weight || 0).toFixed(1)} kg</span>
                    <strong className="font-mono" style={{ color: 'var(--text-main)' }}>${Number(s.cost || 0).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
