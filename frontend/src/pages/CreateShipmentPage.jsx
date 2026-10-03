import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  User, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Sparkles,
  DollarSign,
  Weight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { SidebarNav } from '../components/SidebarNav';
import { CargoParcelVisual } from '../components/CargoParcelVisual';
import { shipmentApi } from '../api/shipmentApi';

export function CreateShipmentPage({ activePage, onNavigate, onCreateSuccess }) {
  const [formData, setFormData] = useState({
    shipmentId: '',
    senderName: '',
    receiverName: '',
    source: '',
    destination: '',
    packageDescription: '',
    weight: '3.5'
  });

  const [cost, setCost] = useState(100);
  const [calculatingCost, setCalculatingCost] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      shipmentId: prev.shipmentId || `SH00${randomSuffix}`
    }));
  }, []);

  useEffect(() => {
    const w = parseFloat(formData.weight);
    if (!isNaN(w) && w > 0) {
      let isMounted = true;
      setCalculatingCost(true);
      shipmentApi.calculateCost(w)
        .then((res) => {
          if (isMounted && res && typeof res.cost === 'number') {
            setCost(res.cost);
          }
        })
        .catch(() => {
          // Fallback to real Java backend business rule formula
          if (w <= 1.0) setCost(50);
          else if (w <= 5.0) setCost(50 + (w - 1) * 20);
          else if (w <= 10.0) setCost(130 + (w - 5) * 15);
          else setCost(205 + (w - 10) * 10);
        })
        .finally(() => {
          if (isMounted) setCalculatingCost(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    setApiError(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.shipmentId.trim()) errors.shipmentId = 'Shipment ID is required';
    if (!formData.senderName.trim()) errors.senderName = 'Sender Name is required';
    if (!formData.receiverName.trim()) errors.receiverName = 'Receiver Name is required';
    if (!formData.source.trim()) errors.source = 'Source location is required';
    if (!formData.destination.trim()) errors.destination = 'Destination location is required';
    if (!formData.packageDescription.trim()) errors.packageDescription = 'Package description is required';
    
    const w = parseFloat(formData.weight);
    if (isNaN(w) || w <= 0) {
      errors.weight = 'Weight must be greater than 0 kg';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setApiError(null);

      const payload = {
        shipmentId: formData.shipmentId.trim(),
        senderName: formData.senderName.trim(),
        receiverName: formData.receiverName.trim(),
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        packageDescription: formData.packageDescription.trim(),
        weight: parseFloat(formData.weight)
      };

      const created = await shipmentApi.createShipment(payload);
      if (onCreateSuccess) {
        onCreateSuccess(created);
      }
      onNavigate('shipments');

    } catch (err) {
      setApiError(err.message || 'Failed to create shipment in database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-layout-sidebar">
      
      {/* Workspace Sidebar Navigation */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Create Shipment Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Create Consignment
            </h1>
            <p className="page-subtitle">
              Register a new freight package with automated tiered tariff calculation and cloud persistence.
            </p>
          </div>
        </div>

        {/* Guided Step Workflow Progress */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '14px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8125rem' }}>1</span>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)' }}>Consignment Details</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Origin, Destination &amp; Parties</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#bfdbfe', margin: '0 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', border: '1px solid var(--primary-blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8125rem' }}>2</span>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)' }}>Weight &amp; Tariff</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Real-Time Cost Evaluation</div>
            </div>
          </div>

          <div style={{ flex: 1, height: '2px', background: '#e2e8f0', margin: '0 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-subtle)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8125rem' }}>3</span>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-muted)' }}>Dispatch &amp; Track</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>Supabase PostgreSQL Write</div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* Left Form Panel */}
          <div className="card-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-card)' }}>
              Shipment Information
            </h2>

            {apiError && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                fontSize: '0.8125rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Shipment ID */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>
                  Shipment Tracking ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="shipmentId"
                    value={formData.shipmentId}
                    onChange={handleChange}
                    placeholder="e.g. SH008492"
                    className="form-control font-mono"
                    style={{ fontWeight: '800', paddingLeft: '38px', height: '44px' }}
                  />
                  <Package style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                </div>
                {formErrors.shipmentId && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.shipmentId}</span>
                )}
              </div>

              {/* Sender & Receiver Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>
                    Sender / Consignor <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Global Logistics"
                      className="form-control"
                      style={{ paddingLeft: '38px', height: '44px' }}
                    />
                    <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                  </div>
                  {formErrors.senderName && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.senderName}</span>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>
                    Receiver / Consignee <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Distribution Hub"
                      className="form-control"
                      style={{ paddingLeft: '38px', height: '44px' }}
                    />
                    <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                  </div>
                  {formErrors.receiverName && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.receiverName}</span>
                  )}
                </div>
              </div>

              {/* Route: Origin & Destination */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>
                    Origin Hub / Source <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="e.g. Singapore (SIN)"
                      className="form-control"
                      style={{ paddingLeft: '38px', height: '44px' }}
                    />
                    <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                  </div>
                  {formErrors.source && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.source}</span>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>
                    Destination Port / City <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g. Tokyo (TYO)"
                      className="form-control"
                      style={{ paddingLeft: '38px', height: '44px' }}
                    />
                    <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                  </div>
                  {formErrors.destination && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.destination}</span>
                  )}
                </div>
              </div>

              {/* Package Description */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>
                  Cargo Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    placeholder="e.g. Precision Semiconductor Components"
                    className="form-control"
                    style={{ paddingLeft: '38px', height: '44px' }}
                  />
                  <FileText style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                </div>
                {formErrors.packageDescription && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.packageDescription}</span>
                )}
              </div>

              {/* Weight input with quick selection */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: '700' }}>
                  Gross Weight (kg) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-control font-mono"
                    style={{ paddingLeft: '38px', height: '44px', fontWeight: '800' }}
                  />
                  <Weight style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
                </div>
                {formErrors.weight && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>{formErrors.weight}</span>
                )}

                {/* Quick Weight Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick select:</span>
                  {['1.0', '3.5', '5.0', '8.0', '12.0', '25.0'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, weight: w }))}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: formData.weight === w ? 'var(--primary-blue)' : 'var(--bg-subtle)',
                        color: formData.weight === w ? '#ffffff' : 'var(--text-body)',
                        border: '1px solid var(--border-card)'
                      }}
                    >
                      {w} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action Button */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-card)', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', height: '48px', fontSize: '0.9375rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      <span>Writing to Supabase Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Register &amp; Dispatch Shipment</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Pricing Summary & Cargo Visual Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Pricing Summary Card */}
            <div className="card-panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid var(--border-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Automated Tariff Pricing
                </h3>
                <span style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                  Live API
                </span>
              </div>

              {/* Calculated Total Cost Display */}
              <div style={{ padding: '20px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', textAlign: 'center', marginBottom: '16px', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  Calculated Shipment Tariff
                </div>
                <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)', margin: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  ${calculatingCost ? '...' : cost.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Evaluated for <strong>{formData.weight || 0} kg</strong> payload
                </div>
              </div>

              {/* Tiered Tariff Matrix Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Base Weight (≤ 1.0 kg)</span>
                  <strong style={{ color: 'var(--text-main)' }}>$50.00 flat</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Standard Tier (1.0 – 5.0 kg)</span>
                  <strong style={{ color: 'var(--text-main)' }}>+$20.00 / kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Medium Tier (5.0 – 10.0 kg)</span>
                  <strong style={{ color: 'var(--text-main)' }}>+$15.00 / kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Heavy Tier (&gt; 10.0 kg)</span>
                  <strong style={{ color: 'var(--text-main)' }}>+$10.00 / kg</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-card)', fontSize: '0.6875rem', color: '#059669' }}>
                <ShieldCheck style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span>Computed via Java CostCalculator service</span>
              </div>
            </div>

            {/* 3D Cargo Parcel Visual Box */}
            <div className="card-panel">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
                Parcel Geometry &amp; Cargo Box
              </h3>
              <CargoParcelVisual weight={parseFloat(formData.weight) || 3.5} />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
