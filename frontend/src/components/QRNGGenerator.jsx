import React from 'react';
import { Play, RotateCcw, Cpu, Radio, Sparkles } from 'lucide-react';

const PRESETS = [8, 16, 32, 64, 128, 256, 512, 1024];

export default function QRNGGenerator({
  bitCount,
  setBitCount,
  backend,
  setBackend,
  onGenerate,
  onReset,
  loading,
  error
}) {
  const handlePresetClick = (val) => {
    setBitCount(val);
  };

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setBitCount('');
    } else {
      setBitCount(val);
    }
  };

  const isInvalid = !bitCount || bitCount < 1 || bitCount > 4096;

  return (
    <div className="glass-card" id="card-qrng-generator">
      <div className="card-header">
        <h2 className="card-title">
          <Sparkles size={20} />
          Quantum Bit Generator
        </h2>
      </div>

      {/* Bit Count Presets */}
      <div className="control-group">
        <div className="label-row">
          <label className="control-label" htmlFor="custom-bits-input">
            Number of Quantum Bits
          </label>
          <span className="input-helper">Range: 1 – 4,096 bits</span>
        </div>

        <div className="preset-pills" id="bit-preset-pills">
          {PRESETS.map((val) => (
            <button
              key={val}
              type="button"
              id={`preset-btn-${val}`}
              className={`preset-pill ${bitCount === val ? 'active' : ''}`}
              onClick={() => handlePresetClick(val)}
            >
              {val}b
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="custom-input-wrapper">
          <input
            id="custom-bits-input"
            type="number"
            min="1"
            max="4096"
            className="custom-input"
            value={bitCount}
            onChange={handleCustomChange}
            placeholder="Enter custom bit count..."
          />
        </div>
      </div>

      {/* Backend Selection */}
      <div className="control-group">
        <div className="label-row">
          <label className="control-label">Quantum Execution Target</label>
        </div>

        <div className="backend-grid" id="backend-target-selection">
          <button
            type="button"
            id="backend-option-simulator"
            className={`backend-option ${backend === 'simulator' ? 'active' : ''}`}
            onClick={() => setBackend('simulator')}
          >
            <div className="backend-name">
              <Cpu size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              Quantum Simulator
            </div>
            <div className="backend-desc">Qiskit 2.5 StatevectorSampler (Local)</div>
          </button>

          <button
            type="button"
            id="backend-option-hardware"
            className={`backend-option ${backend === 'mock_hardware' ? 'active' : ''}`}
            onClick={() => setBackend('mock_hardware')}
          >
            <div className="backend-name">
              <Radio size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
              IBM Quantum Ready
            </div>
            <div className="backend-desc">Qiskit Runtime Channel (Token in .env)</div>
          </button>
        </div>
      </div>

      {/* Validation / Error Message */}
      {error && (
        <div style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          type="button"
          id="btn-generate-qrng"
          className="btn-generate"
          disabled={loading || isInvalid}
          onClick={onGenerate}
        >
          {loading ? (
            <>
              <div className="status-indicator" style={{ background: '#060911', boxShadow: 'none' }} />
              <span>Collapsing Wavefunction...</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Generate Quantum Bits</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="btn-reset-qrng"
          className="btn-reset"
          disabled={loading}
          onClick={onReset}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
