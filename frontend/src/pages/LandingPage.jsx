import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers, 
  Database, 
  Server, 
  Calculator, 
  Clock, 
  MapPin,
  Plane,
  Anchor,
  Compass,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { shipmentApi } from '../api/shipmentApi';

export function LandingPage({ shipments = [], stats, onNavigate, onSelectShipment }) {
  // Live statistics from real backend data
  const totalCount = stats?.total ?? shipments.length;
  const transitCount = stats?.inTransit ?? 0;
  const deliveredCount = stats?.delivered ?? 0;
  const cancelledCount = stats?.cancelled ?? 0;

  // Interactive Live Tariff Calculator State
  const [calcWeight, setCalcWeight] = useState(3.0);
  const [calcResult, setCalcResult] = useState({ weight: 3.0, cost: 90.0, formula: 'Tier 2 (1-5 kg): ₹50 + (2.0 kg × ₹20)' });
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchLiveCost = async () => {
      setCalcLoading(true);
      try {
        const res = await shipmentApi.calculateCost(calcWeight);
        if (active && res) {
          setCalcResult(res);
        }
      } catch (err) {
        // Fallback standard formula representation
        let cost = 50;
        let formula = 'Base (0-1 kg): ₹50';
        const w = Number(calcWeight) || 1;
        if (w <= 1) {
          cost = 50;
        } else if (w <= 5) {
          cost = 50 + (w - 1) * 20;
          formula = `Tier 2 (1-5 kg): ₹50 + (${(w - 1).toFixed(1)} kg × ₹20)`;
        } else if (w <= 10) {
          cost = 130 + (w - 5) * 15;
          formula = `Tier 3 (5-10 kg): ₹130 + (${(w - 5).toFixed(1)} kg × ₹15)`;
        } else {
          cost = 205 + (w - 10) * 10;
          formula = `Tier 4 (>10 kg): ₹205 + (${(w - 10).toFixed(1)} kg × ₹10)`;
        }
        if (active) setCalcResult({ weight: w, cost, formula });
      } finally {
        if (active) setCalcLoading(false);
      }
    };

    const timer = setTimeout(fetchLiveCost, 120);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [calcWeight]);

  return (
    <div className="landing-container">
      
      {/* =========================================================================
          SECTION 1 — HERO SECTION (Image 2 Target Specification)
          ========================================================================= */}
      <section className="image2-hero-section">
        
        {/* Left Column: Headline, Description & CTAs */}
        <div className="image2-hero-left">
          
          <h1 className="image2-hero-title">
            Global<br />
            Shipment<br />
            <span className="image2-hero-title-accent">Control</span>
          </h1>

          <div className="image2-hero-subtext">
            <p className="image2-tagline-lead">Track. Manage. Deliver.</p>
            <p className="image2-tagline-sub">A smarter way to move the world.</p>
          </div>

          <div className="image2-cta-row">
            <button
              onClick={() => onNavigate('create')}
              className="image2-btn-primary"
            >
              <span>Create Shipment</span>
            </button>

            <button
              onClick={() => onNavigate('shipments')}
              className="image2-btn-secondary"
            >
              <span>Explore Shipments</span>
            </button>
          </div>

        </div>

        {/* Right Column: Hero Visual Graphic */}
        <div className="image2-hero-visual-wrapper">
          <div className="image2-visual-card">
            <img 
              src="/assets/shipflow_hero_globe.jpg" 
              alt="ShipFlow Global Logistics Hero Visual" 
              className="image2-hero-image"
            />
          </div>
        </div>

      </section>

      {/* Hero Live Statistics Bar (Synchronized with Backend Data) */}
      <section className="image2-stats-bar">
        
        <div className="image2-stat-item">
          <div className="image2-stat-icon-box image2-icon-blue">
            <Package style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <div className="image2-stat-number">{totalCount.toLocaleString()}</div>
            <div className="image2-stat-label">Total Shipments</div>
          </div>
        </div>

        <div className="image2-stat-divider" />

        <div className="image2-stat-item">
          <div className="image2-stat-icon-box image2-icon-violet">
            <Truck style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <div className="image2-stat-number">{transitCount.toLocaleString()}</div>
            <div className="image2-stat-label">In Transit</div>
          </div>
        </div>

        <div className="image2-stat-divider" />

        <div className="image2-stat-item">
          <div className="image2-stat-icon-box image2-icon-green">
            <CheckCircle2 style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <div className="image2-stat-number">{deliveredCount.toLocaleString()}</div>
            <div className="image2-stat-label">Delivered</div>
          </div>
        </div>

        <div className="image2-stat-divider" />

        <div className="image2-stat-item">
          <div className="image2-stat-icon-box image2-icon-red">
            <XCircle style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <div className="image2-stat-number">{cancelledCount.toLocaleString()}</div>
            <div className="image2-stat-label">Cancelled</div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2 — WHAT IS SHIPFLOW?
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Platform Overview</span>
          <h2 className="section-heading">One Control Center for Global Shipments</h2>
          <p className="section-subheading">
            SHIPFLOW brings precision orchestration to modern logistics operations with unified dispatch, automated tiered billing, interactive map routing, and enterprise cloud persistence.
          </p>
        </div>

        <div className="features-grid-3col">
          
          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-blue">
              <Package style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Complete Consignment Lifecycle</h3>
            <p className="feature-description">
              Create and manage consignments with origin, destination, parcel dimensions, and status governance (`CREATED` &rarr; `IN_TRANSIT` &rarr; `DELIVERED` / `CANCELLED`).
            </p>
          </div>

          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-indigo">
              <Calculator style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Automated Tariff Engine</h3>
            <p className="feature-description">
              Instantaneous real-time cost calculation based on strict weight slabs, eliminating pricing discrepancies and manual estimation delays.
            </p>
          </div>

          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-cyan">
              <Compass style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Interactive Freight Radar</h3>
            <p className="feature-description">
              Visual map telemetry projecting domestic and international transit corridors, status-colored markers, and shipment location nodes.
            </p>
          </div>

          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-emerald">
              <Database style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Supabase Cloud Persistence</h3>
            <p className="feature-description">
              Rock-solid PostgreSQL cloud database persistence with SSL connections, check constraints, schema integrity, and automated timestamps.
            </p>
          </div>

          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-amber">
              <Activity style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Operational Analytics</h3>
            <p className="feature-description">
              Real-time trend analysis of shipment volumes, delivery performance ratios, transit bottlenecks, and revenue totals.
            </p>
          </div>

          <div className="feature-modern-card">
            <div className="feature-icon-wrapper icon-violet">
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="feature-title">Lifecycle Transition Safeguards</h3>
            <p className="feature-description">
              Enforces terminal state integrity so delivered and cancelled orders cannot be tampered with or modified.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — HOW SHIPFLOW WORKS (4-Step Workflow)
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Workflow</span>
          <h2 className="section-heading">How SHIPFLOW Works</h2>
          <p className="section-subheading">
            A seamless four-step pipeline from booking dispatch to delivery confirmation.
          </p>
        </div>

        <div className="workflow-steps-grid">
          
          <div className="workflow-step-card">
            <div className="workflow-step-number">01</div>
            <div className="workflow-step-icon"><Package style={{ width: '20px', height: '20px' }} /></div>
            <h4 className="workflow-step-title">Create</h4>
            <p className="workflow-step-desc">
              Create a shipment with sender, receiver, source, destination, package description and weight.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">02</div>
            <div className="workflow-step-icon"><Zap style={{ width: '20px', height: '20px' }} /></div>
            <h4 className="workflow-step-title">Calculate</h4>
            <p className="workflow-step-desc">
              The tariff engine calculates the shipment cost according to the project's defined weight slabs.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">03</div>
            <div className="workflow-step-icon"><Globe style={{ width: '20px', height: '20px' }} /></div>
            <h4 className="workflow-step-title">Track</h4>
            <p className="workflow-step-desc">
              Monitor shipment status, origin-destination routes, and real-time transit telemetry.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">04</div>
            <div className="workflow-step-icon"><CheckCircle2 style={{ width: '20px', height: '20px' }} /></div>
            <h4 className="workflow-step-title">Deliver</h4>
            <p className="workflow-step-desc">
              Update the shipment lifecycle through supported status transitions with terminal safeguards.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — SMART SHIPPING COST & LIVE TARIFF CALCULATOR
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Tariff Engine</span>
          <h2 className="section-heading">Smart Shipping Cost Calculation</h2>
          <p className="section-subheading">
            Transparent, tiered pricing formulas strictly computed by the Java REST backend API.
          </p>
        </div>

        <div className="tariff-showcase-grid">
          
          {/* Slabs & Examples Table */}
          <div className="card-panel">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator style={{ width: '18px', height: '18px', color: 'var(--primary-blue)' }} />
              <span>Official Tariff Rate Slabs</span>
            </h3>

            <div className="tariff-table-wrapper">
              <table className="custom-table" style={{ fontSize: '0.8125rem' }}>
                <thead>
                  <tr>
                    <th>Weight Slab</th>
                    <th>Pricing Formula</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>0 &lt; w &le; 1.0 kg</strong></td>
                    <td>Flat ₹50.00 base charge</td>
                    <td><span className="badge-pill">1.0 kg &rarr; ₹50</span></td>
                  </tr>
                  <tr>
                    <td><strong>1.0 &lt; w &le; 5.0 kg</strong></td>
                    <td>₹50 + ₹20.00 / kg above 1 kg</td>
                    <td><span className="badge-pill">3.0 kg &rarr; ₹90</span></td>
                  </tr>
                  <tr>
                    <td><strong>5.0 &lt; w &le; 10.0 kg</strong></td>
                    <td>₹130 + ₹15.00 / kg above 5 kg</td>
                    <td><span className="badge-pill">7.0 kg &rarr; ₹160</span></td>
                  </tr>
                  <tr>
                    <td><strong>w &gt; 10.0 kg</strong></td>
                    <td>₹205 + ₹10.00 / kg above 10 kg</td>
                    <td><span className="badge-pill">12.0 kg &rarr; ₹225</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Verified Benchmarks:</span>
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>1kg=₹50</span> • 
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>5kg=₹130</span> • 
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>10kg=₹205</span>
            </div>
          </div>

          {/* Interactive Live Calculator Card Connected to Real API */}
          <div className="card-panel interactive-calc-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Live Tariff Simulator
              </h3>
              <span style={{ fontSize: '0.6875rem', fontWeight: '800', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', padding: '3px 8px', borderRadius: '6px' }}>
                GET /api/calculate-cost
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Parcel Weight (kg)</label>
                <span className="font-mono" style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  {calcWeight.toFixed(1)} kg
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="25"
                step="0.1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0.1)}
                style={{ width: '100%', accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                <span>0.1 kg</span>
                <span>5.0 kg</span>
                <span>10.0 kg</span>
                <span>25.0 kg</span>
              </div>
            </div>

            <div className="calc-result-display">
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Computed Shipping Tariff
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  ₹{calcResult.cost?.toFixed(2) ?? '0.00'}
                </span>
                {calcLoading && <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>(Calculating...)</span>}
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-body)', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
                {calcResult.formula || `Formula computed for ${calcWeight} kg`}
              </div>
            </div>

            <button
              onClick={() => onNavigate('create')}
              className="btn-primary"
              style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '0.875rem' }}
            >
              <span>Book Shipment at ₹{calcResult.cost?.toFixed(2) ?? '0.00'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — GLOBAL LOGISTICS HUBS & CORRIDORS
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Global Network</span>
          <h2 className="section-heading">Global Logistics &amp; Corridor Routing</h2>
          <p className="section-subheading">
            Connect multimodal domestic supply chains with international air and maritime freight gateways.
          </p>
        </div>

        <div className="logistics-corridors-grid">
          
          <div className="corridor-card">
            <div className="corridor-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Plane style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 className="corridor-title">Air Freight Corridors</h4>
            <p className="corridor-desc">
              Express express air cargo links connecting major hubs (SIN, LAX, LHR, DXB, NRT, FRA) with guaranteed transit intervals.
            </p>
          </div>

          <div className="corridor-card">
            <div className="corridor-icon-box" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <Anchor style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 className="corridor-title">Maritime Gateways</h4>
            <p className="corridor-desc">
              High-capacity oceanic freight routes linking container terminals (Mumbai Port, Singapore Port, LA Port) with full manifest tracking.
            </p>
          </div>

          <div className="corridor-card">
            <div className="corridor-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Truck style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 className="corridor-title">Domestic Express Arteries</h4>
            <p className="corridor-desc">
              Rapid surface transit corridors spanning key industrial centers (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad, Kolkata).
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — LIVE SHIPMENT OVERVIEW
          ========================================================================= */}
      <section className="landing-section">
        <div className="card-panel">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
            <div>
              <span className="section-badge" style={{ marginBottom: '6px' }}>Live Database Records</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Active Consignment Overview
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Directly synchronized with Supabase PostgreSQL cloud database ({shipments.length} records).
              </p>
            </div>

            <button
              onClick={() => onNavigate('shipments')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
            >
              <span>View All Shipments ({shipments.length})</span>
              <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>

          {/* Compact Live Table Preview */}
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Route</th>
                  <th>Sender &rarr; Receiver</th>
                  <th>Weight</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shipments.slice(0, 4).map((s) => (
                  <tr key={s.shipmentId} onClick={() => onSelectShipment(s)} style={{ cursor: 'pointer' }}>
                    <td className="font-mono" style={{ fontWeight: '800', color: 'var(--primary-blue)' }}>
                      {s.shipmentId}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.8125rem' }}>
                        {s.source} &rarr; {s.destination}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.sender} &rarr; {s.receiver}
                      </div>
                    </td>
                    <td className="font-mono">{s.weight} kg</td>
                    <td className="font-mono" style={{ fontWeight: '700' }}>₹{s.cost}</td>
                    <td>
                      <span className={`status-badge-inline status-${s.status?.toLowerCase() || 'created'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {shipments.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No shipments registered yet. Click below to create your first shipment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — TECHNICAL ARCHITECTURE
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Engineering</span>
          <h2 className="section-heading">Modern Full-Stack SaaS Architecture</h2>
          <p className="section-subheading">
            Strict separation of concerns with clean controller, service, DAO, and cloud database layers.
          </p>
        </div>

        <div className="architecture-flow-wrapper">
          
          <div className="arch-node-card">
            <div className="arch-badge">Client Layer</div>
            <h4 className="arch-title">React / Vite</h4>
            <p className="arch-desc">Component UI, interactive maps, dynamic state &amp; client routing</p>
          </div>

          <div className="arch-connector-arrow">&rarr;</div>

          <div className="arch-node-card">
            <div className="arch-badge">API Gateway</div>
            <h4 className="arch-title">Java REST API</h4>
            <p className="arch-desc">HTTP Controller endpoints (`/api/shipments`, `/api/health`)</p>
          </div>

          <div className="arch-connector-arrow">&rarr;</div>

          <div className="arch-node-card">
            <div className="arch-badge">Business Logic</div>
            <h4 className="arch-title">Shipment Service</h4>
            <p className="arch-desc">Tariff calculation, validation &amp; state lifecycle rules</p>
          </div>

          <div className="arch-connector-arrow">&rarr;</div>

          <div className="arch-node-card">
            <div className="arch-badge">Data Access</div>
            <h4 className="arch-title">JDBC DAO Layer</h4>
            <p className="arch-desc">Prepared statements, connection pooling &amp; query mapping</p>
          </div>

          <div className="arch-connector-arrow">&rarr;</div>

          <div className="arch-node-card" style={{ borderColor: '#a7f3d0', background: '#f0fdf4' }}>
            <div className="arch-badge" style={{ background: '#ecfdf5', color: '#059669' }}>Persistence</div>
            <h4 className="arch-title" style={{ color: '#065f46' }}>Supabase PostgreSQL</h4>
            <p className="arch-desc">SSL relational storage, constraints, indexes &amp; automated triggers</p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — DATABASE & CLOUD PERSISTENCE
          ========================================================================= */}
      <section className="landing-section">
        <div className="card-panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <span className="section-badge">Cloud Database</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                Supabase PostgreSQL Persistence
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                All shipment records, tariff costs, routes, and lifecycle timestamps are persisted in a fully managed PostgreSQL database with encrypted SSL connections and automated triggers.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span>Relational Schema with Check Constraints &amp; Status Validation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span>Fast Indexed Lookups on Shipment ID, Status &amp; Timestamps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span>Automated `updated_at` triggers and terminal state safeguards</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', color: '#f8fafc', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '12px' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>database/schema.sql</span>
                <span style={{ fontSize: '0.6875rem', background: '#1e293b', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px' }}>PostgreSQL 15</span>
              </div>
              <pre className="font-mono" style={{ fontSize: '0.6875rem', lineHeight: '1.5', color: '#cbd5e1', overflowX: 'auto' }}>
{`CREATE TABLE shipments (
  id VARCHAR(64) PRIMARY KEY,
  sender VARCHAR(255) NOT NULL,
  receiver VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  package_description TEXT,
  weight NUMERIC(10,2) CHECK (weight > 0),
  cost NUMERIC(10,2) CHECK (cost >= 0),
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — FINAL CTA SECTION
          ========================================================================= */}
      <section className="landing-final-cta-card">
        <div className="final-cta-content">
          <h2 className="final-cta-heading">Ready to take control of every shipment?</h2>
          <p className="final-cta-desc">
            Orchestrate domestic and global freight corridors with automated tariff calculations, interactive map tracking, and cloud persistence.
          </p>
          <div className="final-cta-buttons">
            <button
              onClick={() => onNavigate('create')}
              className="image2-btn-primary"
              style={{ padding: '14px 36px' }}
            >
              <span>Create Shipment</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="image2-btn-secondary"
              style={{ padding: '14px 36px' }}
            >
              <span>Explore Dashboard</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
