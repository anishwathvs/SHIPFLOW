import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Globe, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Search, 
  Filter, 
  MapPin, 
  Navigation,
  ArrowRight,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Truck
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';

// Geocoding dictionary for cities
const CITY_COORDINATES = {
  // Indian Cities
  'chennai': [13.0827, 80.2707],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'mumbai': [19.0760, 72.8777],
  'mumbai port': [18.9438, 72.8465],
  'delhi': [28.6139, 77.2090],
  'delhi hub': [28.5562, 77.1000],
  'hyderabad': [17.3850, 78.4867],
  'kolkata': [22.5726, 88.3639],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'kochi': [9.9312, 76.2673],
  'jaipur': [26.9124, 75.7873],
  'goa': [15.2993, 74.1240],

  // International Logistics Hubs
  'singapore': [1.3521, 103.8198],
  'sin': [1.3644, 103.9915],
  'los angeles': [34.0522, -118.2437],
  'lax': [33.9416, -118.4085],
  'new york': [40.7128, -74.0060],
  'jfk': [40.6413, -73.7781],
  'london': [51.5074, -0.1278],
  'lhr': [51.4700, -0.4543],
  'tokyo': [35.6762, 139.6503],
  'nrt': [35.7720, 140.3929],
  'hnd': [35.5494, 139.7798],
  'dubai': [25.2048, 55.2708],
  'dxb': [25.2532, 55.3657],
  'sydney': [33.8688 * -1, 151.2093],
  'syd': [33.9399 * -1, 151.1753],
  'frankfurt': [50.1109, 8.6821],
  'fra': [50.0379, 8.5622],
  'paris': [48.8566, 2.3522],
  'cdg': [49.0097, 2.5479],
  'hong kong': [22.3193, 114.1694],
  'hkg': [22.3080, 113.9185],
  'shanghai': [31.2304, 121.4737],
  'san francisco': [37.7749, -122.4194],
  'sfo': [37.6213, -122.3790],
  'chicago': [41.8781, -87.6298],
  'ord': [41.9742, -87.9073],
  'toronto': [43.6532, -79.3832],
  'yyz': [43.6777, -79.6248],
  'dallas': [32.7767, -96.7970],
  'dfw': [32.8998, -97.0403],
  'miami': [25.7617, -80.1918],
  'mia': [25.7959, -80.2870]
};

function getCoords(cityName) {
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
  const lng = 60 + (Math.abs(hash >> 3) % 60);
  return [lat, lng];
}

const TILE_LAYERS = {
  voyager: {
    name: 'Standard Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
  },
  osm: {
    name: 'Standard Streets',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Terrain / Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};

const STATUS_COLORS = {
  'CREATED': '#2563eb',     // Blue
  'IN_TRANSIT': '#f59e0b',   // Orange / Amber
  'DELIVERED': '#10b981',    // Green
  'CANCELLED': '#ef4444'     // Red
};

export function GlobalMapPage({ shipments = [], stats, activePage, onNavigate, onSelectShipment }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [tileStyle, setTileStyle] = useState('voyager');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Filter shipments based on search and status
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        !q ||
        s.shipmentId?.toLowerCase().includes(q) ||
        s.sender?.toLowerCase().includes(q) ||
        s.receiver?.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q) ||
        s.destination?.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [shipments, statusFilter, searchQuery]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629], // Center around India / Asia
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false // custom controls
      });

      const tileConfig = TILE_LAYERS[tileStyle];
      const tileLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      mapInstanceRef.current._tileLayer = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (map._tileLayer) {
      map.removeLayer(map._tileLayer);
    }
    const tileConfig = TILE_LAYERS[tileStyle];
    const newLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19
    }).addTo(map);
    map._tileLayer = newLayer;
  }, [tileStyle]);

  // Render Markers and Route Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = [];

    filteredShipments.forEach((shipment) => {
      const srcCoords = getCoords(shipment.source);
      const destCoords = getCoords(shipment.destination);
      const color = STATUS_COLORS[shipment.status] || '#2563eb';

      // 1. Draw Route Line if both origin and destination exist
      if (srcCoords && destCoords) {
        bounds.push(srcCoords);
        bounds.push(destCoords);

        const isTransit = shipment.status === 'IN_TRANSIT';
        const polyline = L.polyline([srcCoords, destCoords], {
          color: color,
          weight: isTransit ? 3.5 : 2.5,
          opacity: 0.85,
          dashArray: isTransit ? '8, 8' : undefined,
          className: isTransit ? 'leaflet-animated-route' : ''
        });

        polyline.bindTooltip(
          `<b>${shipment.shipmentId}</b>: ${shipment.source} &rarr; ${shipment.destination} (${shipment.status})`,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        );

        polyline.on('click', () => {
          setSelectedShipment(shipment);
        });

        polyline.addTo(layerGroup);
      }

      // 2. Add Origin Marker
      if (srcCoords) {
        const originIcon = L.divIcon({
          className: 'custom-map-pin-icon',
          html: `
            <div class="map-pin-bubble" style="background: ${color}; box-shadow: 0 4px 14px ${color}88;">
              <div class="map-pin-inner"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(srcCoords, { icon: originIcon });

        // Popup Content
        const popupContent = `
          <div class="map-popup-card">
            <div class="map-popup-header">
              <span class="map-popup-id">${shipment.shipmentId}</span>
              <span class="map-popup-badge" style="background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
                ${shipment.status}
              </span>
            </div>
            <div class="map-popup-route">
              <strong>${shipment.source}</strong> &rarr; <strong>${shipment.destination}</strong>
            </div>
            <div class="map-popup-details">
              <div><span>Sender:</span> ${shipment.sender}</div>
              <div><span>Receiver:</span> ${shipment.receiver}</div>
              <div><span>Package:</span> ${shipment.packageDescription || 'Standard Cargo'}</div>
              <div><span>Weight:</span> ${shipment.weight} kg</div>
              <div><span>Cost:</span> ₹${shipment.cost}</div>
            </div>
            <button id="btn-details-${shipment.shipmentId}" class="map-popup-btn">
              View Shipment Details &rarr;
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, className: 'leaflet-custom-popup' });
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-details-${shipment.shipmentId}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectShipment) onSelectShipment(shipment);
            };
          }
        });

        marker.on('click', () => {
          setSelectedShipment(shipment);
        });

        marker.addTo(layerGroup);
      }

      // 3. Add Destination Marker
      if (destCoords && (destCoords[0] !== srcCoords?.[0] || destCoords[1] !== srcCoords?.[1])) {
        const destIcon = L.divIcon({
          className: 'custom-map-dest-icon',
          html: `
            <div class="map-dest-bubble" style="border-color: ${color};">
              <div class="map-dest-dot" style="background: ${color};"></div>
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const destMarker = L.marker(destCoords, { icon: destIcon });
        destMarker.bindTooltip(`Destination: ${shipment.destination}`, { sticky: true });
        destMarker.addTo(layerGroup);
      }
    });

    // Auto fit bounds if coordinates exist and not zoomed in manually
    if (bounds.length > 0 && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      } catch (e) {
        // ignore bounds calculation edge cases
      }
    }

  }, [filteredShipments]);

  // Zoom handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.setView([20.5937, 78.9629], 3);
  };

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Map Viewport */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe style={{ width: '26px', height: '26px', color: 'var(--primary-blue)' }} />
              <span>Global Shipment Map</span>
            </h1>
            <p className="page-subtitle">
              Standard interactive map telemetry tracking live consignments, hubs, and status routes.
            </p>
          </div>

          {/* Map Style Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Layer:</span>
            {Object.entries(TILE_LAYERS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setTileStyle(key)}
                className={tileStyle === key ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {cfg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="map-toolbar-card">
          
          <div className="map-search-box">
            <Search style={{ width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by ID, city, sender, receiver..."
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

          <div className="map-status-filters">
            {['ALL', 'CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`map-filter-btn ${statusFilter === st ? 'active' : ''}`}
              >
                {st === 'ALL' && 'All Shipments'}
                {st === 'CREATED' && <><span className="status-dot dot-blue" /> Created</>}
                {st === 'IN_TRANSIT' && <><span className="status-dot dot-amber" /> In Transit</>}
                {st === 'DELIVERED' && <><span className="status-dot dot-green" /> Delivered</>}
                {st === 'CANCELLED' && <><span className="status-dot dot-red" /> Cancelled</>}
              </button>
            ))}
          </div>

        </div>

        {/* Interactive Map Container with Floating HUD Controls */}
        <div className="map-wrapper-panel">
          
          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} className="leaflet-map-canvas" />

          {/* Floating Top Left Control HUD (Telemetry & Stats) */}
          <div className="map-floating-hud">
            <div className="hud-title">
              <Navigation style={{ width: '15px', height: '15px', color: 'var(--primary-blue)' }} />
              <span>Fleet Telemetry</span>
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
            <div className="legend-header">Map Legend</div>
            <div className="legend-items-list">
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CREATED }} />
                <span>Blue: Created</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.IN_TRANSIT }} />
                <span>Orange: In Transit</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.DELIVERED }} />
                <span>Green: Delivered</span>
              </div>
              <div className="legend-entry">
                <span className="legend-dot" style={{ background: STATUS_COLORS.CANCELLED }} />
                <span>Red: Cancelled</span>
              </div>
            </div>
          </div>

          {/* Custom Floating Zoom & Pan Controls (Bottom Right) */}
          <div className="map-floating-controls">
            <button onClick={handleZoomIn} className="map-ctrl-btn" title="Zoom In">
              <ZoomIn style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={handleZoomOut} className="map-ctrl-btn" title="Zoom Out">
              <ZoomOut style={{ width: '18px', height: '18px' }} />
            </button>
            <button onClick={handleResetView} className="map-ctrl-btn" title="Reset Center">
              <Crosshair style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Selected Shipment Spotlight Card (Top Right) */}
          {selectedShipment && (
            <div className="map-selected-spotlight">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  {selectedShipment.shipmentId}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: '800', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    background: `${STATUS_COLORS[selectedShipment.status]}20`,
                    color: STATUS_COLORS[selectedShipment.status]
                  }}
                >
                  {selectedShipment.status}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {selectedShipment.source} &rarr; {selectedShipment.destination}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px' }}>
                <div><strong>Sender:</strong> {selectedShipment.sender}</div>
                <div><strong>Receiver:</strong> {selectedShipment.receiver}</div>
                <div><strong>Weight &amp; Cost:</strong> {selectedShipment.weight} kg • ₹{selectedShipment.cost}</div>
              </div>

              <button
                onClick={() => onSelectShipment(selectedShipment)}
                className="btn-primary"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.75rem' }}
              >
                <span>Open Tracking Details</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
