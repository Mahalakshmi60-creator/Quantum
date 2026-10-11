import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QRNGGenerator from './components/QRNGGenerator';
import ResultsDisplay from './components/ResultsDisplay';
import QuantumCircuit from './components/QuantumCircuit';
import Statistics from './components/Statistics';
import RandomnessAnalysis from './components/RandomnessAnalysis';
import EducationalPanel from './components/EducationalPanel';
import { qrngApi } from './services/qrngApi';

export default function App() {
  const [bitCount, setBitCount] = useState(128);
  const [backend, setBackend] = useState('simulator');
  const [qrngData, setQrngData] = useState(null);
  const [circuitData, setCircuitData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [vivaOpen, setVivaOpen] = useState(false);

  // Initial check and auto-generation on load
  useEffect(() => {
    const initApp = async () => {
      // 1. Health check
      const health = await qrngApi.checkHealth();
      setBackendHealthy(health.status === 'healthy');

      // 2. Load circuit architecture
      try {
        const circ = await qrngApi.getCircuit();
        if (circ?.circuit) {
          setCircuitData(circ.circuit);
        }
      } catch (err) {
        console.warn('Circuit fetch non-fatal:', err);
      }

      // 3. Initial generation (128 bits)
      try {
        setLoading(true);
        const initialResult = await qrngApi.generateBits(128, 'simulator');
        setQrngData(initialResult);
        if (initialResult?.circuit) {
          setCircuitData(initialResult.circuit);
        }
      } catch (err) {
        console.warn('Initial generate non-fatal:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleGenerate = async () => {
    if (!bitCount || bitCount < 1 || bitCount > 4096) {
      setError('Please select a bit count between 1 and 4,096.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await qrngApi.generateBits(bitCount, backend);
      setQrngData(result);
      if (result.circuit) {
        setCircuitData(result.circuit);
      }
      setBackendHealthy(true);
    } catch (err) {
      setError(err.message || 'Failed to communicate with quantum backend.');
      setBackendHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBitCount(128);
    setBackend('simulator');
    setQrngData(null);
    setError(null);
  };

  return (
    <>
      {/* Top Navigation */}
      <Navbar
        backendHealthy={backendHealthy}
        onOpenViva={() => setVivaOpen(true)}
      />

      {/* Main Dashboard Layout */}
      <main className="dashboard-main container">
        {/* Hero Section */}
        <section className="hero-banner">
          <h1 className="hero-title">Quantum Random Number Generator</h1>
          <p className="hero-subtitle">
            Harnessing quantum superposition and Born rule measurement collapse to generate true physical entropy via Qiskit.
          </p>
        </section>

        {/* Dual Column Layout */}
        <div className="dashboard-grid">
          {/* Left Column: Generator Controls & Measurement Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <QRNGGenerator
              bitCount={bitCount}
              setBitCount={setBitCount}
              backend={backend}
              setBackend={setBackend}
              onGenerate={handleGenerate}
              onReset={handleReset}
              loading={loading}
              error={error}
            />

            <ResultsDisplay
              data={qrngData}
              loading={loading}
            />

            <QuantumCircuit
              circuitData={circuitData}
            />
          </div>

          {/* Right Column: Statistics & Randomness Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Statistics
              data={qrngData}
            />

            <RandomnessAnalysis
              data={qrngData}
            />
          </div>
        </div>
      </main>

      {/* Capstone Viva Guide Modal */}
      <EducationalPanel
        isOpen={vivaOpen}
        onClose={() => setVivaOpen(false)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Quantum Random Number Generator (QRNG) &bull; Built with Qiskit 2.5 &amp; FastAPI &bull; Adheres to ARCHITECTURE.md
          </p>
        </div>
      </footer>
    </>
  );
}
