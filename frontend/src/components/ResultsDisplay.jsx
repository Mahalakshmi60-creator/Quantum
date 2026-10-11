import React, { useState } from 'react';
import { Copy, Check, Download, Binary, Hash, FileCode, Layers } from 'lucide-react';

export default function ResultsDisplay({ data, loading }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'stream' | 'decimal' | 'hex'
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="glass-card" id="card-results-loading">
        <div className="card-header">
          <h2 className="card-title">
            <Binary size={20} />
            Quantum Measurement Output
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div className="atom-icon" style={{ margin: '0 auto 16px auto', width: 48, height: 48 }}>
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="10" fill="#00f2fe" />
              <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#00f2fe" strokeWidth="3" transform="rotate(30 50 50)" />
              <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#a855f7" strokeWidth="3" transform="rotate(-30 50 50)" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Superposition Active: Sampling Quantum Circuit...
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: 6 }}>
            Applying Hadamard gate and executing Born rule measurements in Qiskit.
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.bits) {
    return (
      <div className="glass-card" id="card-results-empty">
        <div className="card-header">
          <h2 className="card-title">
            <Binary size={20} />
            Quantum Measurement Output
          </h2>
        </div>
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-dim)' }}>
          <p style={{ fontSize: '0.95rem' }}>
            No quantum measurements yet. Select bit count and click <strong>Generate Quantum Bits</strong>.
          </p>
        </div>
      </div>
    );
  }

  const { bits, decimalValue, hexValue, totalBits, telemetry } = data;

  const handleCopy = () => {
    let contentToCopy = bits;
    if (viewMode === 'decimal') contentToCopy = decimalValue;
    if (viewMode === 'hex') contentToCopy = hexValue;

    navigator.clipboard.writeText(contentToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (format) => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `quantum_random_bits_${totalBits}.${format}`;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
    } else {
      content = `Quantum Random Number Generator Output\n`;
      content += `Generated: ${new Date().toISOString()}\n`;
      content += `Backend: ${telemetry?.backend || 'Qiskit Simulator'}\n`;
      content += `Total Bits: ${totalBits}\n\n`;
      content += `Binary Sequence:\n${bits}\n\n`;
      content += `Decimal Value:\n${decimalValue}\n\n`;
      content += `Hexadecimal Value:\n${hexValue}\n`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Group bitstream by bytes for raw stream view
  const formattedStream = bits.match(/.{1,8}/g)?.join(' ') || bits;

  return (
    <div className="glass-card" id="card-results-display">
      <div className="card-header">
        <h2 className="card-title">
          <Binary size={20} />
          Quantum Measurement Output
        </h2>

        {/* View Mode Switcher */}
        <div className="results-header-actions">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Interactive Bit Grid"
          >
            <Layers size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            Grid
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'stream' ? 'active' : ''}`}
            onClick={() => setViewMode('stream')}
            title="Raw Monospace Sequence"
          >
            <Binary size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            Binary
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'decimal' ? 'active' : ''}`}
            onClick={() => setViewMode('decimal')}
            title="Deterministic Decimal Conversion"
          >
            <Hash size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            Decimal
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'hex' ? 'active' : ''}`}
            onClick={() => setViewMode('hex')}
            title="Hexadecimal Format"
          >
            <FileCode size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            Hex
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' && (
        <div className="bit-grid" id="bit-grid-container">
          {bits.split('').map((bit, idx) => (
            <div
              key={idx}
              className={`bit-chip bit-${bit}`}
              title={`Qubit measurement #${idx + 1}: ${bit}`}
            >
              {bit}
            </div>
          ))}
        </div>
      )}

      {viewMode === 'stream' && (
        <div className="raw-stream-box" id="raw-stream-container">
          {formattedStream}
        </div>
      )}

      {viewMode === 'decimal' && (
        <div className="conversion-box" id="decimal-value-container">
          <div className="conversion-label">Arbitrary-Precision Base-10 Value:</div>
          {decimalValue}
        </div>
      )}

      {viewMode === 'hex' && (
        <div className="conversion-box" id="hex-value-container">
          <div className="conversion-label">Base-16 Hexadecimal Representation:</div>
          {hexValue}
        </div>
      )}

      {/* Action & Telemetry Bar */}
      <div className="export-bar">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            id="btn-copy-bits"
            className={`btn-small ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            id="btn-download-txt"
            className="btn-small"
            onClick={() => handleDownload('txt')}
          >
            <Download size={14} />
            <span>TXT</span>
          </button>

          <button
            type="button"
            id="btn-download-json"
            className="btn-small"
            onClick={() => handleDownload('json')}
          >
            <Download size={14} />
            <span>JSON</span>
          </button>
        </div>

        {telemetry && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
            <span>{telemetry.backend?.split('(')[0]?.trim()}</span>
            <span style={{ margin: '0 6px' }}>•</span>
            <span style={{ color: 'var(--cyan-glow)' }}>{telemetry.executionTimeMs} ms</span>
          </div>
        )}
      </div>
    </div>
  );
}
