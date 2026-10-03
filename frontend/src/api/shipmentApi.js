/**
 * Central API client for the Shipment Management REST Backend.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Normalizes API response or extracts error message.
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = (data && data.error) || (typeof data === 'string' && data) || `HTTP Error ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const shipmentApi = {
  /**
   * Health check
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await handleResponse(res);
    } catch (err) {
      return { status: 'DOWN', error: err.message, database: 'UNREACHABLE' };
    }
  },

  /**
   * Fetch all shipments
   */
  async fetchShipments() {
    const res = await fetch(`${API_BASE}/shipments`);
    return await handleResponse(res);
  },

  /**
   * Fetch a single shipment by its ID
   */
  async fetchShipmentById(id) {
    const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(id)}`);
    return await handleResponse(res);
  },

  /**
   * Create a new shipment
   */
  async createShipment(shipmentData) {
    const res = await fetch(`${API_BASE}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });
    return await handleResponse(res);
  },

  /**
   * Update the status of an existing shipment
   */
  async updateShipmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  },

  /**
   * Calculate live cost based on weight
   */
  async calculateCost(weight) {
    if (!weight || isNaN(weight) || Number(weight) <= 0) {
      throw new Error('Weight must be a positive number');
    }
    const res = await fetch(`${API_BASE}/calculate-cost?weight=${encodeURIComponent(weight)}`);
    return await handleResponse(res);
  },
};
