import React from 'react';
import { X, BookOpen, AlertTriangle, Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function EducationalPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="viva-overlay" id="viva-modal-overlay" onClick={onClose}>
      <div
        className="viva-modal"
        id="viva-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="viva-header">
          <h2>
            <BookOpen size={24} style={{ color: 'var(--cyan-glow)' }} />
            Capstone Viva & Quantum Theory Guide
          </h2>
          <button
            type="button"
            className="btn-close"
            id="btn-close-viva-modal"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 19 Mandatory Architecture Disclaimer */}
        <div className="alert-disclaimer" id="viva-section-19-disclaimer">
          <AlertTriangle size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#fcd34d', display: 'block', marginBottom: 4 }}>
              Architectural Transparency Principle (Section 19)
            </strong>
            <p>
              "This implementation demonstrates quantum random number generation using a simulated quantum circuit.
              Physical quantum randomness requires execution on real quantum hardware."
            </p>
          </div>
        </div>

        {/* Section 1: PRNG vs QRNG Comparison */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={18} style={{ color: 'var(--cyan-glow)' }} />
            1. QRNG vs Classical PRNG
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#f87171', marginBottom: 6 }}>
                Classical PRNG (Pseudorandom)
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, lineHeight: 1.6 }}>
                <li>Uses deterministic arithmetic (e.g. Mersenne Twister, LCG).</li>
                <li>Given the seed and internal state, 100% predictable.</li>
                <li>Periods eventually repeat after N iterations.</li>
                <li>Unsuitable for high-security one-time pads.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: 6 }}>
                True QRNG (Quantum)
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, lineHeight: 1.6 }}>
                <li>Governed by the Born Rule of quantum mechanics.</li>
                <li>Measurement outcome is fundamentally non-deterministic.</li>
                <li>No hidden variables or mathematical seed.</li>
                <li>Provides true physical entropy.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Top Viva Questions & Answers */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={18} style={{ color: 'var(--purple-glow)' }} />
            2. High-Yield Viva Questions & Model Answers
          </h3>

          <div className="qa-card">
            <div className="qa-question">
              Q1: How does a single qubit circuit generate a random bit?
            </div>
            <div className="qa-answer">
              We initialize the qubit in ground state <code>|0⟩</code>, apply a <strong>Hadamard (H) gate</strong> to rotate the state vector into an equal superposition <code>(|0⟩ + |1⟩) / √2</code>. By <strong>Born's rule</strong>, when measured in the computational basis <code>{'{|0⟩, |1⟩}'}</code>, the wavefunction collapses with probability <code>|1/√2|² = 0.5</code> for outcome 0 and <code>0.5</code> for outcome 1.
            </div>
          </div>

          <div className="qa-card">
            <div className="qa-question">
              Q2: Why does an 8-bit quantum measurement not always yield exactly 4 zeros and 4 ones?
            </div>
            <div className="qa-answer">
              True randomness is independent shot-to-shot (i.i.d. Bernoulli trials). For small sample sizes, variance naturally occurs. According to the <strong>Law of Large Numbers</strong> and the Central Limit Theorem, the distribution converges to 50.0% asymptotically as the number of bits increases. A sequence that always forces exactly 50% would be synthetic and non-random!
            </div>
          </div>

          <div className="qa-card">
            <div className="qa-question">
              Q3: What is the NIST SP 800-22 Frequency (Monobit) Test?
            </div>
            <div className="qa-answer">
              It calculates the normalized difference between ones and zeros: <code>S_obs = |ones - zeros| / √n</code>. Using the complementary error function <code>P-value = erfc(S_obs / √2)</code>, it assesses if the deviation from 50% is within statistical expectation. Sequences with <code>P-value ≥ 0.01</code> pass as uniformly random.
            </div>
          </div>

          <div className="qa-card">
            <div className="qa-question">
              Q4: What is the difference between a quantum simulator and physical quantum hardware?
            </div>
            <div className="qa-answer">
              A quantum simulator (like Qiskit's <code>StatevectorSampler</code>) computes the state vector matrix mathematically and uses a computer's pseudo-random sampler to draw from the probability distribution. Physical quantum hardware (like superconducting qubits at IBM Quantum) measures physical microvolt fluctuations or phase differences, yielding true natural quantum entropy.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <button
            type="button"
            className="btn-generate"
            style={{ display: 'inline-flex', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={onClose}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
