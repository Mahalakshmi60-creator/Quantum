import React, { useState } from 'react';
import { Cpu, Eye, Code, Terminal, Copy, Check } from 'lucide-react';

export default function QuantumCircuit({ circuitData }) {
  const [tab, setTab] = useState('diagram'); // 'diagram' | 'ascii' | 'qasm'
  const [copiedQasm, setCopiedQasm] = useState(false);

  const asciiText = circuitData?.ascii || `     ┌───┐ ░ ┌─┐
q: ──┤ H ├─░─┤M├───
     └───┘ ░ └╥┘
c: ═══════════╩════`;

  const qasmText = circuitData?.qasm || `OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
h q[0];
measure q[0] -> c[0];`;

  const handleCopyQasm = () => {
    navigator.clipboard.writeText(qasmText).then(() => {
      setCopiedQasm(true);
      setTimeout(() => setCopiedQasm(false), 2000);
    });
  };

  return (
    <div className="glass-card" id="card-quantum-circuit">
      <div className="card-header">
        <h2 className="card-title">
          <Cpu size={20} />
          Quantum Circuit Architecture
        </h2>

        {/* Tab switchers */}
        <div className="results-header-actions">
          <button
            type="button"
            className={`view-mode-btn ${tab === 'diagram' ? 'active' : ''}`}
            onClick={() => setTab('diagram')}
          >
            <Eye size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            Schematic
          </button>
          <button
            type="button"
            className={`view-mode-btn ${tab === 'ascii' ? 'active' : ''}`}
            onClick={() => setTab('ascii')}
          >
            <Terminal size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            ASCII
          </button>
          <button
            type="button"
            className={`view-mode-btn ${tab === 'qasm' ? 'active' : ''}`}
            onClick={() => setTab('qasm')}
          >
            <Code size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
            QASM
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Circuit Schematic */}
      {tab === 'diagram' && (
        <div id="circuit-schematic-view">
          <div className="circuit-schematic">
            <div className="circuit-wire">
              {/* Qubit State */}
              <div className="gate-node">
                <div className="gate-box state-node">|0⟩</div>
                <div className="gate-label">Ground State</div>
              </div>

              {/* Hadamard Gate */}
              <div className="gate-node">
                <div className="gate-box" title="Hadamard Gate: Creates equal superposition">
                  H
                </div>
                <div className="gate-label">Hadamard</div>
              </div>

              {/* Superposition Indicator */}
              <div className="gate-node">
                <div className="gate-box state-node" style={{ borderColor: '#a855f7', color: '#c084fc' }}>
                  |+⟩
                </div>
                <div className="gate-label">Superposition</div>
              </div>

              {/* Measurement Meter */}
              <div className="gate-node">
                <div className="gate-box measure-node" title="Measurement: Collapses superposition to 0 or 1">
                  M
                </div>
                <div className="gate-label">Measurement</div>
              </div>

              {/* Classical Bit Output */}
              <div className="gate-node">
                <div className="gate-box state-node" style={{ borderColor: '#10b981', color: '#34d399' }}>
                  c[0]
                </div>
                <div className="gate-label">Output Bit</div>
              </div>
            </div>
          </div>

          {/* Mathematical State Evolution Card */}
          <div className="math-state-steps">
            <div className="math-step">
              <span className="step-badge">STAGE 1</span>
              <div className="step-formula">|ψ₀⟩ = |0⟩ = [1, 0]ᵀ</div>
              <div className="step-desc">Qubit initialized to deterministic ground state.</div>
            </div>

            <div className="math-step purple-border">
              <span className="step-badge">STAGE 2</span>
              <div className="step-formula">|ψ₁⟩ = H|0⟩ = (|0⟩ + |1⟩) / √2</div>
              <div className="step-desc">Unitary transformation into equal superposition.</div>
            </div>

            <div className="math-step emerald-border">
              <span className="step-badge">STAGE 3</span>
              <div className="step-formula">P(0) = |⟨0|ψ₁⟩|² = 0.5, &nbsp; P(1) = |⟨1|ψ₁⟩|² = 0.5</div>
              <div className="step-desc">Born Rule: Equal 50% probability upon collapse.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ASCII Circuit View */}
      {tab === 'ascii' && (
        <div id="circuit-ascii-view">
          <div className="code-block" style={{ color: '#00f2fe' }}>
            {asciiText}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8 }}>
            Generated directly by Qiskit QuantumCircuit.draw(output='text')
          </div>
        </div>
      )}

      {/* Tab 3: OpenQASM 2.0 View */}
      {tab === 'qasm' && (
        <div id="circuit-qasm-view">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              type="button"
              className={`btn-small ${copiedQasm ? 'copied' : ''}`}
              onClick={handleCopyQasm}
            >
              {copiedQasm ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedQasm ? 'Copied' : 'Copy QASM'}</span>
            </button>
          </div>
          <div className="code-block">
            {qasmText}
          </div>
        </div>
      )}
    </div>
  );
}
