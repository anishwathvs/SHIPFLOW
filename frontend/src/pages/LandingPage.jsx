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
  Compass,
  Activity,
  Boxes,
  Lock,
  Cpu
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
        // Fallback standard tariff calculation
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
          1. FULL-WIDTH CINEMATIC BACKGROUND HERO
          The artwork (Earth, route network, airplanes, ships, boxes, clouds)
          occupies the full background, with content cleanly overlaid.
          ========================================================================= */}
      <section className="cinematic-hero-banner">
        
        {/* Subtle Frosted Gradient Overlay for High Readability */}
        <div className="cinematic-hero-overlay" />

        {/* Hero Content Container */}
        <div className="cinematic-hero-content">
          
          <div className="cinematic-hero-badge">
            <span className="pulse-dot" />
            <span>Logistics Intelligence Platform</span>
          </div>

          <h1 className="cinematic-hero-title">
            GLOBAL<br />
            SHIPMENT<br />
            <span className="cinematic-hero-title-accent">CONTROL</span>
          </h1>

          <div className="cinematic-hero-tagline">
            <p className="tagline-primary">Track. Manage. Deliver.</p>
            <p className="tagline-secondary">A smarter way to move the world.</p>
          </div>

          <div className="cinematic-hero-cta-group">
            <button
              onClick={() => onNavigate('create')}
              className="image2-btn-primary"
            >
              <span>Create Shipment</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>

            <button
              onClick={() => onNavigate('shipments')}
              className="image2-btn-secondary"
            >
              <span>Explore Shipments</span>
            </button>
          </div>

        </div>

        {/* Floating Live Fleet Statistics Bar (Embedded in Hero Lower Section) */}
        <div className="cinematic-hero-stats-wrapper">
          <div className="image2-stats-bar">
            
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

          </div>
        </div>

      </section>

      {/* =========================================================================
          2. WHAT SHIPFLOW DOES (4 Distinct Accent Cards)
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Platform Overview</span>
          <h2 className="section-heading">One Control Center for Global Shipments</h2>
          <p className="section-subheading">
            SHIPFLOW brings shipment creation, cost calculation, tracking, status management and logistics visibility into one centralized platform.
          </p>
        </div>

        <div className="product-cards-grid-4col">
          
          {/* Card 1: Shipment Management (Blue) */}
          <div className="product-card card-accent-blue">
            <div className="product-card-icon icon-blue">
              <Package style={{ width: '22px', height: '22px' }} />
            </div>
            <h3 className="product-card-title">Shipment Management</h3>
            <p className="product-card-text">
              Create and manage shipment records from one place with complete sender, receiver, and parcel attributes.
            </p>
          </div>

          {/* Card 2: Smart Cost Calculation (Violet) */}
          <div className="product-card card-accent-violet">
            <div className="product-card-icon icon-violet">
              <Calculator style={{ width: '22px', height: '22px' }} />
            </div>
            <h3 className="product-card-title">Smart Cost Calculation</h3>
            <p className="product-card-text">
              Calculate shipment pricing using defined weight-based tariff rules with instant automated billing.
            </p>
          </div>

          {/* Card 3: Live Tracking (Cyan) */}
          <div className="product-card card-accent-cyan">
            <div className="product-card-icon icon-cyan">
              <Compass style={{ width: '22px', height: '22px' }} />
            </div>
            <h3 className="product-card-title">Live Tracking</h3>
            <p className="product-card-text">
              Monitor shipment status, origin-to-destination routes, and real-time transit telemetry across active corridors.
            </p>
          </div>

          {/* Card 4: Cloud Persistence (Green) */}
          <div className="product-card card-accent-green">
            <div className="product-card-icon icon-emerald">
              <Database style={{ width: '22px', height: '22px' }} />
            </div>
            <h3 className="product-card-title">Cloud Persistence</h3>
            <p className="product-card-text">
              Keep shipment records securely persisted in Supabase PostgreSQL with relational integrity and check constraints.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (4-Step Workflow)
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Simple Pipeline</span>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">
            A reliable 4-step consignment workflow from booking to final delivery.
          </p>
        </div>

        <div className="workflow-steps-grid">
          
          <div className="workflow-step-card">
            <div className="workflow-step-number">01</div>
            <div className="workflow-step-icon"><Package style={{ width: '18px', height: '18px' }} /></div>
            <h4 className="workflow-step-title">CREATE</h4>
            <p className="workflow-step-desc">
              Enter sender, receiver, source, destination, package and weight.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">02</div>
            <div className="workflow-step-icon"><Zap style={{ width: '18px', height: '18px' }} /></div>
            <h4 className="workflow-step-title">CALCULATE</h4>
            <p className="workflow-step-desc">
              The tariff engine calculates the shipment cost.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">03</div>
            <div className="workflow-step-icon"><Globe style={{ width: '18px', height: '18px' }} /></div>
            <h4 className="workflow-step-title">TRACK</h4>
            <p className="workflow-step-desc">
              Monitor status and shipment route.
            </p>
          </div>

          <div className="workflow-step-connector" />

          <div className="workflow-step-card">
            <div className="workflow-step-number">04</div>
            <div className="workflow-step-icon"><CheckCircle2 style={{ width: '18px', height: '18px' }} /></div>
            <h4 className="workflow-step-title">DELIVER</h4>
            <p className="workflow-step-desc">
              Manage the shipment lifecycle through its supported statuses.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. SHIPPING COST & LIVE SIMULATOR
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Tariff Rules</span>
          <h2 className="section-heading">Transparent Shipping Cost</h2>
          <p className="section-subheading">
            Predictable weight-based tariff slabs calculated directly by the REST backend.
          </p>
        </div>

        <div className="tariff-showcase-grid">
          
          {/* Rate Slabs Table */}
          <div className="card-panel">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
              Tariff Slabs &amp; Examples
            </h3>

            <div className="tariff-table-wrapper">
              <table className="custom-table" style={{ fontSize: '0.8125rem' }}>
                <thead>
                  <tr>
                    <th>Weight Slab</th>
                    <th>Rate Formula</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>0 &lt; w &le; 1 kg</strong></td>
                    <td>Flat ₹50 base charge</td>
                    <td><span className="badge-pill">1 kg &rarr; ₹50</span></td>
                  </tr>
                  <tr>
                    <td><strong>1 &lt; w &le; 5 kg</strong></td>
                    <td>₹50 + ₹20 per kg above 1 kg</td>
                    <td><span className="badge-pill">3 kg &rarr; ₹90</span></td>
                  </tr>
                  <tr>
                    <td><strong>5 &lt; w &le; 10 kg</strong></td>
                    <td>₹130 + ₹15 per kg above 5 kg</td>
                    <td><span className="badge-pill">7 kg &rarr; ₹160</span></td>
                  </tr>
                  <tr>
                    <td><strong>w &gt; 10 kg</strong></td>
                    <td>₹205 + ₹10 per kg above 10 kg</td>
                    <td><span className="badge-pill">12 kg &rarr; ₹225</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Key Benchmarks:</span>
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>1kg = ₹50</span> • 
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>5kg = ₹130</span> • 
              <span className="font-mono" style={{ fontWeight: '700', color: 'var(--text-main)' }}>10kg = ₹205</span>
            </div>
          </div>

          {/* Interactive Simulator */}
          <div className="card-panel interactive-calc-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Live Tariff Simulator
              </h3>
              <span style={{ fontSize: '0.6875rem', fontWeight: '800', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', padding: '3px 8px', borderRadius: '6px' }}>
                Instant Pricing
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Parcel Weight</label>
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
                Estimated Cost
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                  ₹{calcResult.cost?.toFixed(2) ?? '0.00'}
                </span>
                {calcLoading && <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>(Computing...)</span>}
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
          5. LIVE SHIPMENTS OVERVIEW
          ========================================================================= */}
      <section className="landing-section">
        <div className="card-panel">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
            <div>
              <span className="section-badge" style={{ marginBottom: '6px' }}>Live Fleet Data</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Active Consignments
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Real-time manifest from database ({shipments.length} total records).
              </p>
            </div>

            <button
              onClick={() => onNavigate('shipments')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
            >
              <span>View Shipments</span>
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
                      No shipments yet. Click "Create Shipment" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. TECHNOLOGY (Clean Product-Style Cards — No Raw Code/SQL)
          ========================================================================= */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-badge">Technology Stack</span>
          <h2 className="section-heading">Modern Full-Stack Engineering</h2>
          <p className="section-subheading">
            Built with enterprise Java architecture, high-performance React UI, and cloud relational storage.
          </p>
        </div>

        <div className="tech-stack-cards-grid">
          
          <div className="tech-card">
            <div className="tech-card-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Layers style={{ width: '20px', height: '20px' }} />
            </div>
            <h4 className="tech-card-title">React + Vite</h4>
            <p className="tech-card-role">Frontend Application</p>
            <p className="tech-card-desc">Modern component-driven UI with dedicated vanilla design system</p>
          </div>

          <div className="tech-card">
            <div className="tech-card-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <Server style={{ width: '20px', height: '20px' }} />
            </div>
            <h4 className="tech-card-title">Java REST API</h4>
            <p className="tech-card-role">Backend Server</p>
            <p className="tech-card-desc">Java 21 Sun HttpHandler REST endpoints and business validation</p>
          </div>

          <div className="tech-card">
            <div className="tech-card-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Cpu style={{ width: '20px', height: '20px' }} />
            </div>
            <h4 className="tech-card-title">Controller / Service / DAO</h4>
            <p className="tech-card-role">Application Architecture</p>
            <p className="tech-card-desc">Strict separation of concerns with layered domain services</p>
          </div>

          <div className="tech-card">
            <div className="tech-card-icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
              <Zap style={{ width: '20px', height: '20px' }} />
            </div>
            <h4 className="tech-card-title">JDBC</h4>
            <p className="tech-card-role">Database Access</p>
            <p className="tech-card-desc">Prepared statements with parameter binding and connection pooling</p>
          </div>

          <div className="tech-card" style={{ borderColor: '#a7f3d0' }}>
            <div className="tech-card-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Database style={{ width: '20px', height: '20px' }} />
            </div>
            <h4 className="tech-card-title" style={{ color: '#065f46' }}>Supabase PostgreSQL</h4>
            <p className="tech-card-role">Cloud Persistence</p>
            <p className="tech-card-desc">Encrypted SSL cloud relational storage with check constraints</p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="landing-final-cta-card">
        <div className="final-cta-content">
          <h2 className="final-cta-heading">Take Control of Every Shipment</h2>
          <p className="final-cta-desc">
            Create, manage and track shipments from one centralized logistics platform.
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
              <span>View Dashboard</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
