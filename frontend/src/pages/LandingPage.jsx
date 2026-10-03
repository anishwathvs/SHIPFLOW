import React from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle,
  ShieldCheck, 
  Zap, 
  Globe 
} from 'lucide-react';

export function LandingPage({ shipments = [], stats, onNavigate }) {
  // Use real numbers from database
  const totalCount = stats?.total ?? shipments.length;
  const transitCount = stats?.inTransit ?? 0;
  const deliveredCount = stats?.delivered ?? 0;
  const cancelledCount = stats?.cancelled ?? 0;

  return (
    <div className="landing-container">
      
      {/* 1. Hero Section matching Image 2 */}
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

      {/* 2. Floating Statistics Pill Bar (Matching Image 2) */}
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

      {/* 3. Three Capability Feature Cards */}
      <section className="landing-features-grid">
        
        <div className="card-panel">
          <div className="feature-icon-box" style={{ background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}>
            <Truck style={{ width: '22px', height: '22px' }} />
          </div>
          <h3 className="feature-card-title">Multi-Tier Logistics Routing</h3>
          <p className="feature-card-desc">
            Real-time tracking of active shipments across domestic and global air &amp; freight corridors with lifecycle state safeguards.
          </p>
        </div>

        <div className="card-panel">
          <div className="feature-icon-box" style={{ background: '#eef2ff', color: '#6366f1', borderColor: '#c7d2fe' }}>
            <Zap style={{ width: '22px', height: '22px' }} />
          </div>
          <h3 className="feature-card-title">Tiered Tariff Engine</h3>
          <p className="feature-card-desc">
            Instant automated pricing adhering to tiered formulas (0-1kg: ₹50, 1-5kg: +₹20/kg, 5-10kg: +₹15/kg, &gt;10kg: +₹10/kg).
          </p>
        </div>

        <div className="card-panel">
          <div className="feature-icon-box" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
            <ShieldCheck style={{ width: '22px', height: '22px' }} />
          </div>
          <h3 className="feature-card-title">Supabase Cloud Database</h3>
          <p className="feature-card-desc">
            Rock-solid PostgreSQL persistence with SSL encryption, check constraints, schema migrations, and real-time query support.
          </p>
        </div>

      </section>

    </div>
  );
}
