import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  User, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Sparkles
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
    weight: '3.0'
  });

  const [cost, setCost] = useState(90);
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
      
      {/* Sidebar */}
      <SidebarNav activePage={activePage} onNavigate={onNavigate} />

      {/* Main Form Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              Create New Shipment
            </h1>
            <p className="page-subtitle">
              Add a new shipment with complete origin, destination, and package details.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-wizard">
          <div className="step-node">
            <span className="step-badge active">1</span>
            <span className="step-text">Details</span>
          </div>
          <div className="step-divider" />
          <div className="step-node">
            <span className="step-badge active">2</span>
            <span className="step-text">Package</span>
          </div>
          <div className="step-divider" />
          <div className="step-node">
            <span className="step-badge active">3</span>
            <span className="step-text">Review</span>
          </div>
        </div>

        {/* 2-Column Composition */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* Left Form Panel */}
          <div className="card-panel">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-card)' }}>
              Shipment Details
            </h2>

            {apiError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                fontSize: '0.75rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', shrink: 0 }} />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Shipment ID */}
              <div className="form-group">
                <label className="form-label">
                  Shipment ID <span>*</span>
                </label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="shipmentId"
                    value={formData.shipmentId}
                    onChange={handleChange}
                    placeholder="e.g. SH001234"
                    className="form-control font-mono"
                    style={{ fontWeight: '700' }}
                  />
                  <Package className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                </div>
                {formErrors.shipmentId && (
                  <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.shipmentId}</span>
                )}
              </div>

              {/* Sender & Receiver Row */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">
                    Sender Name <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Johnson"
                      className="form-control"
                    />
                    <User className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                  </div>
                  {formErrors.senderName && (
                    <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.senderName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Receiver Name <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleChange}
                      placeholder="e.g. Maria Garcia"
                      className="form-control"
                    />
                    <User className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                  </div>
                  {formErrors.receiverName && (
                    <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.receiverName}</span>
                  )}
                </div>
              </div>

              {/* Source & Destination Row */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">
                    Source Location <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="e.g. Chennai / Singapore"
                      className="form-control"
                    />
                    <MapPin className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                  </div>
                  {formErrors.source && (
                    <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.source}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Destination Location <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru / Los Angeles"
                      className="form-control"
                    />
                    <MapPin className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                  </div>
                  {formErrors.destination && (
                    <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.destination}</span>
                  )}
                </div>
              </div>

              {/* Package Description */}
              <div className="form-group">
                <label className="form-label">
                  Package Description <span>*</span>
                </label>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    placeholder="e.g. Electronics - Laptop & Peripheral Box"
                    className="form-control"
                  />
                  <FileText className="form-icon-right" style={{ width: '16px', height: '16px' }} />
                </div>
                {formErrors.packageDescription && (
                  <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.packageDescription}</span>
                )}
              </div>

              {/* Weight Slider & Direct Input */}
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Package Weight (kg) <span>*</span>
                  </label>
                  <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1d4ed8', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>
                    {formData.weight} kg
                  </span>
                </div>
                
                <div className="form-range-container">
                  <input
                    type="range"
                    min="0.5"
                    max="25.0"
                    step="0.5"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-range-slider"
                  />
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-control font-mono"
                    style={{ width: '80px', textAlign: 'center', fontWeight: '700' }}
                  />
                </div>
                {formErrors.weight && (
                  <span style={{ fontSize: '0.6875rem', color: '#dc2626' }}>{formErrors.weight}</span>
                )}
              </div>

              {/* Submit CTA */}
              <div style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.9375rem' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      <span>Saving to Supabase Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Register &amp; Create Shipment</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Preview Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Cargo Box Visual */}
            <CargoParcelVisual weight={parseFloat(formData.weight) || 3.0} height="220px" />

            {/* Estimated Tariff Card */}
            <div className="card-panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Estimated Freight Tariff
                </span>
                {calculatingCost && (
                  <Loader2 style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="font-display font-mono" style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  ₹{cost.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  for {formData.weight} kg
                </span>
              </div>

              {/* Route Summary */}
              <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-card)', marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Origin:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formData.source || 'Pending Origin'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formData.destination || 'Pending Destination'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Consignee:</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{formData.receiverName || 'Pending Consignee'}</span>
                </div>
              </div>
            </div>

            {/* Pricing Slabs Reference */}
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-card)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Sparkles style={{ width: '13px', height: '13px', color: '#2563eb' }} />
                <span>Tiered Tariff Calculation Slabs</span>
              </div>
              <p>• 0-1 kg: Flat ₹50.00</p>
              <p>• 1-5 kg: ₹50 + ₹20/kg above 1 kg</p>
              <p>• 5-10 kg: ₹130 + ₹15/kg above 5 kg</p>
              <p>• &gt;10 kg: ₹205 + ₹10/kg above 10 kg</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
