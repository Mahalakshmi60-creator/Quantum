/**
 * API client for Quantum Random Number Generator backend services.
 */

const BASE_URL = '/api';

export const qrngApi = {
  /**
   * Generates N quantum random bits using the backend simulator.
   * @param {number} bits - Number of bits (1 to 4096).
   * @param {string} backend - 'simulator' or 'mock_hardware'.
   * @returns {Promise<Object>}
   */
  async generateBits(bits = 128, backend = 'simulator') {
    try {
      const response = await fetch(`${BASE_URL}/qrng/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bits, backend }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail?.message || errData.detail || `Server error (${response.status})`);
      }

      return await response.json();
    } catch (err) {
      console.error('Failed to generate quantum random bits:', err);
      throw err;
    }
  },

  /**
   * Fetches circuit metadata, ASCII drawing, and OpenQASM.
   * @returns {Promise<Object>}
   */
  async getCircuit() {
    try {
      const response = await fetch(`${BASE_URL}/qrng/circuit`);
      if (!response.ok) {
        throw new Error(`Failed to load circuit diagram (${response.status})`);
      }
      return await response.json();
    } catch (err) {
      console.error('Circuit fetch error:', err);
      throw err;
    }
  },

  /**
   * Fetches health status of the quantum backend.
   * @returns {Promise<Object>}
   */
  async checkHealth() {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (!response.ok) {
        return { status: 'unhealthy', error: response.statusText };
      }
      return await response.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  },

  /**
   * Fetches theoretical context and Viva questions.
   * @returns {Promise<Object>}
   */
  async getInfo() {
    try {
      const response = await fetch(`${BASE_URL}/qrng/info`);
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error('Info fetch error:', err);
      return null;
    }
  }
};
