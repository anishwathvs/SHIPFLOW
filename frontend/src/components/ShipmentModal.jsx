import React, { useState, useEffect } from 'react';
import { X, PackagePlus, AlertTriangle, CheckCircle, Calculator, Sparkles } from 'lucide-react';
import { CargoModel } from '../three/CargoModel';
import { shipmentApi } from '../api/shipmentApi';

export function ShipmentModal({ isOpen, onClose, onShipmentCreated }) {
  const [formData, setFormData] = useState({
    shipmentId: '',
    senderName: '',
    receiverName: '',
    source: '',
    destination: '',
    packageDescription: '',
    weight: '3.5',
  });

  const [estimatedCost, setEstimatedCost] = useState(100.0);
  const [loadingCost, setLoadingCost] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live calculation of cost when weight changes (with debounce)
  useEffect(() => {
    const numWeight = parseFloat(formData.weight);
    if (!numWeight || numWeight <= 0) {
      setEstimatedCost(0);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingCost(true);
        const result = await shipmentApi.calculateCost(numWeight);
        if (result && result.cost !== undefined) {
          setEstimatedCost(result.cost);
        }
      } catch (err) {
        console.warn('Live cost estimation error:', err.message);
      } finally {
        setLoadingCost(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.weight]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!formData.shipmentId.trim()) {
      setErrorMessage('Shipment ID is required.');
      return;
    }
    if (!formData.senderName.trim()) {
      setErrorMessage('Sender name is required.');
      return;
    }
    if (!formData.receiverName.trim()) {
      setErrorMessage('Receiver name is required.');
      return;
    }
    if (!formData.source.trim()) {
      setErrorMessage('Source location is required.');
      return;
    }
    if (!formData.destination.trim()) {
      setErrorMessage('Destination location is required.');
      return;
    }
    if (!formData.packageDescription.trim()) {
      setErrorMessage('Package description is required.');
      return;
    }
    const weightNum = parseFloat(formData.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setErrorMessage('Weight must be a positive number greater than 0.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await shipmentApi.createShipment({
        shipmentId: formData.shipmentId.trim(),
        senderName: formData.senderName.trim(),
        receiverName: formData.receiverName.trim(),
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        packageDescription: formData.packageDescription.trim(),
        weight: weightNum,
      });

      onShipmentCreated && onShipmentCreated(created);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create shipment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Create New Shipment Dispatch
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Register package details & automated tariff estimation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with 3D Cargo Visualizer */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Interactive 3D Package Box Preview */}
          <div className="mb-4">
            <CargoModel
              weight={parseFloat(formData.weight) || 1}
              cost={estimatedCost}
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shipment ID */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                SHIPMENT ID *
              </label>
              <input
                type="text"
                name="shipmentId"
                placeholder="e.g. SH-8492"
                value={formData.shipmentId}
                onChange={handleChange}
                className="input-glass font-mono uppercase"
                required
              />
            </div>

            {/* Weight Input with live feedback */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                WEIGHT (KG) * {loadingCost && <span className="text-cyan-400 text-[10px] ml-2 animate-pulse">Calculating...</span>}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="weight"
                placeholder="3.5"
                value={formData.weight}
                onChange={handleChange}
                className="input-glass font-mono text-cyan-300 font-semibold"
                required
              />
            </div>

            {/* Sender Name */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                SENDER NAME *
              </label>
              <input
                type="text"
                name="senderName"
                placeholder="Alice Freeman"
                value={formData.senderName}
                onChange={handleChange}
                className="input-glass"
                required
              />
            </div>

            {/* Receiver Name */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                RECEIVER NAME *
              </label>
              <input
                type="text"
                name="receiverName"
                placeholder="Robert Vance"
                value={formData.receiverName}
                onChange={handleChange}
                className="input-glass"
                required
              />
            </div>

            {/* Origin Location */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                ORIGIN (SOURCE) *
              </label>
              <input
                type="text"
                name="source"
                placeholder="Chennai (MAA)"
                value={formData.source}
                onChange={handleChange}
                className="input-glass"
                required
              />
            </div>

            {/* Destination Location */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                DESTINATION *
              </label>
              <input
                type="text"
                name="destination"
                placeholder="Bangalore (BLR)"
                value={formData.destination}
                onChange={handleChange}
                className="input-glass"
                required
              />
            </div>
          </div>

          {/* Package Description */}
          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">
              PACKAGE DESCRIPTION *
            </label>
            <input
              type="text"
              name="packageDescription"
              placeholder="e.g. Precision Microchip Components & Sensors"
              value={formData.packageDescription}
              onChange={handleChange}
              className="input-glass"
              required
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <div className="text-xs font-mono text-slate-400">
              Initial status: <span className="text-amber-400 font-semibold">CREATED</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs px-4 py-2"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs px-5 py-2.5"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Dispatch Shipment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
