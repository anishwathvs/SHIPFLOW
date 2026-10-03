import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
  Settings,
  AlertCircle
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';

// Curated Geocoding Dictionary for Domestic & Global Logistics Hubs
const CITY_COORDINATES = {
  // Indian Logistics Hubs
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'mumbai port': { lat: 18.9438, lng: 72.8465 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'delhi hub': { lat: 28.5562, lng: 77.1000 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'goa': { lat: 15.2993, lng: 74.1240 },

  // International Hubs
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'sin': { lat: 1.3644, lng: 103.9915 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'lax': { lat: 33.9416, lng: -118.4085 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'jfk': { lat: 40.6413, lng: -73.7781 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'lhr': { lat: 51.4700, lng: -0.4543 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'nrt': { lat: 35.7720, lng: 140.3929 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'dxb': { lat: 25.2532, lng: 55.3657 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'syd': { lat: -33.9399, lng: 151.1753 },
  'frankfurt': { lat: 50.1109, lng: 8.6821 },
  'fra': { lat: 50.0379, lng: 8.5622 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'cdg': { lat: 49.0097, lng: 2.5479 },
  'hong kong': { lat: 22.3193, lng: 114.1694 },
  'shanghai': { lat: 31.2304, lng: 121.4737 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'miami': { lat: 25.7617, lng: -80.1918 }
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
  const lat = 12 + (Math.abs(hash) % 36);
  const lng = 68 + (Math.abs(hash >> 3) % 52);
  return { lat, lng };
}

const STATUS_COLORS = {
  'CREATED': '#2563eb',     // Blue
  'IN_TRANSIT': '#f59e0b',   // Orange / Amber
  'DELIVERED': '#10b981',    // Green
  'CANCELLED': '#ef4444'     // Red
};

export function GlobalMapPage({ shipments = [], stats, activePage, onNavigate, onSelectShipment }) {
  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);

  const [googleKeyExists, setGoogleKeyExists] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [mapTypeId, setMapTypeId] = useState('roadmap');

  // Check Google Maps API Key from environment
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

  // Filter shipments based on search & status
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

  // Initialize Google Maps API
  useEffect(() => {
    if (!apiKey) {
      setGoogleKeyExists(false);
      return;
    }

    setGoogleKeyExists(true);

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
      mapIds: mapId ? [mapId] : undefined
    });

    loader.load()
      .then((google) => {
        if (!mapRef.current) return;

        const mapOptions = {
          center: { lat: 20.5937, lng: 78.9629 }, // Center around India / Asia
          zoom: 3,
          minZoom: 2,
          maxZoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: false,
          fullscreenControl: false,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f7fa' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
            { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#cbd5e1' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0f2fe' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fed7aa' }] }
          ]
        };

        if (mapId) {
          mapOptions.mapId = mapId;
        }

        const map = new google.maps.Map(mapRef.current, mapOptions);
        googleMapInstance.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        setMapLoaded(true);
      })
      .catch((err) => {
        console.warn('Google Maps API failed to load:', err);
        setMapError('Google Maps API key was invalid or rejected. Please check VITE_GOOGLE_MAPS_API_KEY.');
      });
  }, [apiKey, mapId]);

  // Update Markers and Routes whenever filtered shipments change
  useEffect(() => {
    if (!googleMapInstance.current || !window.google) return;

    const map = googleMapInstance.current;
    const google = window.google;

    // Clear existing markers & polylines
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;

    filteredShipments.forEach((shipment) => {
      const src = getCityCoords(shipment.source);
      const dest = getCityCoords(shipment.destination);
      const color = STATUS_COLORS[shipment.status] || '#2563eb';

      // 1. Draw Route Polyline
      if (src && dest) {
        bounds.extend(src);
        bounds.extend(dest);
        hasCoords = true;

        const isTransit = shipment.status === 'IN_TRANSIT';
        const lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 3
        };

        const polyline = new google.maps.Polyline({
          path: [src, dest],
          geodesic: true,
          strokeColor: color,
          strokeOpacity: isTransit ? 0 : 0.85,
          strokeWeight: isTransit ? 3 : 2.5,
          icons: isTransit ? [{
            icon: lineSymbol,
            offset: '0',
            repeat: '14px'
          }] : undefined,
          map: map
        });

        polyline.addListener('click', () => {
          setSelectedShipment(shipment);
        });

        polylinesRef.current.push(polyline);
      }

      // 2. Add Origin Marker with Status Color
      if (src) {
        const marker = new google.maps.Marker({
          position: src,
          map: map,
          title: `${shipment.shipmentId} (${shipment.status})`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5
          }
        });

        marker.addListener('click', () => {
          setSelectedShipment(shipment);

          const content = `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 10px; max-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-family: monospace; font-weight: 800; color: #2563eb; font-size: 13px;">${shipment.shipmentId}</span>
                <span style="background: ${color}20; color: ${color}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">
                  ${shipment.status}
                </span>
              </div>
              <div style="font-weight: 700; color: #0f172a; font-size: 13px; margin-bottom: 4px;">
                ${shipment.source} &rarr; ${shipment.destination}
              </div>
              <div style="font-size: 11px; color: #64748b; line-height: 1.4; margin-bottom: 8px;">
                <div><strong>Sender:</strong> ${shipment.sender}</div>
                <div><strong>Receiver:</strong> ${shipment.receiver}</div>
                <div><strong>Weight &amp; Cost:</strong> ${shipment.weight} kg • ₹${shipment.cost}</div>
              </div>
              <button id="gm-btn-${shipment.shipmentId}" style="width: 100%; padding: 6px 10px; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                View Shipment Details &rarr;
              </button>
            </div>
          `;

          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);

          setTimeout(() => {
            const btn = document.getElementById(`gm-btn-${shipment.shipmentId}`);
            if (btn) {
              btn.onclick = () => {
                if (onSelectShipment) onSelectShipment(shipment);
              };
            }
          }, 100);
        });

        markersRef.current.push(marker);
      }
    });

    if (hasCoords && filteredShipments.length > 0) {
      try {
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } catch (e) {}
    }
  }, [filteredShipments, mapLoaded]);

  // Zoom controls
  const handleZoomIn = () => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setZoom(googleMapInstance.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setZoom(googleMapInstance.current.getZoom() - 1);
    }
  };

  const handleResetCenter = () => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setCenter({ lat: 20.5937, lng: 78.9629 });
      googleMapInstance.current.setZoom(3);
    }
  };

  const handleMapTypeChange = (type) => {
    setMapTypeId(type);
    if (googleMapInstance.current && window.google) {
      googleMapInstance.current.setMapTypeId(type);
    }
  };

  return (
    <div className="page-layout-sidebar">
      
      {/* Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Map Viewport */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe style={{ width: '26px', height: '26px', color: 'var(--primary-blue)' }} />
              <span>Global Shipment Map</span>
            </h1>
            <p className="page-subtitle">
              Interactive Google Maps logistics telemetry tracking active corridors, shipment nodes, and transit corridors.
            </p>
          </div>

          {/* Map Style Controls */}
          {googleKeyExists && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Layer:</span>
              <button
                onClick={() => handleMapTypeChange('roadmap')}
                className={mapTypeId === 'roadmap' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                Roadmap
              </button>
              <button
                onClick={() => handleMapTypeChange('hybrid')}
                className={mapTypeId === 'hybrid' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                Satellite / Hybrid
              </button>
              <button
                onClick={() => handleMapTypeChange('terrain')}
                className={mapTypeId === 'terrain' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                Terrain
              </button>
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

        {/* Map Viewport Card */}
        <div className="map-wrapper-panel">
          
          {googleKeyExists && !mapError ? (
            <>
              {/* Google Maps Container */}
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

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
                <div className="legend-header">Marker Legend</div>
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
                <button onClick={handleZoomIn} className="map-ctrl-btn" title="Zoom In">+</button>
                <button onClick={handleZoomOut} className="map-ctrl-btn" title="Zoom Out">-</button>
                <button onClick={handleResetCenter} className="map-ctrl-btn" title="Recenter">
                  <Crosshair style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Selected Shipment Spotlight Card */}
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
            </>
          ) : (
            /* Clean Configuration / Setup Required State (When Google Maps key is not present locally) */
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--primary-blue-light)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid var(--primary-blue-border)'
              }}>
                <Globe style={{ width: '32px', height: '32px' }} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                Google Maps API Configuration Ready
              </h3>

              <p style={{ maxWidth: '520px', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                The application is integrated with the official Google Maps JavaScript API. To activate live satellite and road telemetry, add your key to <code>frontend/.env</code> as:
              </p>

              <div style={{
                background: '#0f172a',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                padding: '12px 20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <div>VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here</div>
                <div>VITE_GOOGLE_MAP_ID=your_map_id_here (optional)</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => onNavigate('shipments')} className="btn-primary" style={{ fontSize: '0.8125rem' }}>
                  <span>View Shipments Manifest</span>
                </button>
                <button onClick={() => onNavigate('dashboard')} className="btn-secondary" style={{ fontSize: '0.8125rem' }}>
                  <span>Open Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
