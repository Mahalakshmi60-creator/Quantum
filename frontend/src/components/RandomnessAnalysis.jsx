import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Gauge, HelpCircle } from 'lucide-react';

export default function RandomnessAnalysis({ data }) {
  if (!data || !data.randomnessTest) {
    return null;
  }

  const { monobit, runs } = data.randomnessTest;
  const { entropy, idealEntropy } = data;

  return (
    <div className="glass-card" id="card-randomness-analysis">
      <div className="card-header">
        <h2 className="card-title">
          <ShieldCheck size={20} />
          Randomness Analysis (NIST SP 800-22)
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Significance Level: α = 0.01
        </span>
      </div>

      {/* Test 1: Frequency (Monobit) Test */}
      {monobit && (
        <div className="test-card" id="test-monobit-card">
          <div className="test-header">
            <span className="test-name">1. Frequency (Monobit) Test</span>
            <span className={monobit.passed ? 'badge-pass' : 'badge-fail'}>
              {monobit.passed ? 'PASSED (RANDOM)' : 'NON-UNIFORM'}
            </span>
          </div>

          <div className="test-metrics-row">
            <div className="test-metric">
              <div className="test-metric-label">Sn (1s - 0s)</div>
              <div className="test-metric-val">{monobit.s_n}</div>
            </div>
            <div className="test-metric">
              <div className="test-metric-label">S_obs Statistic</div>
              <div className="test-metric-val">{monobit.s_obs}</div>
            </div>
            <div className="test-metric">
              <div className="test-metric-label">P-Value</div>
              <div className="test-metric-val" style={{ color: monobit.passed ? '#34d399' : '#f43f5e' }}>
                {monobit.pValue}
              </div>
            </div>
          </div>

          <p className="test-conclusion">
            {monobit.conclusion} (Threshold: P ≥ 0.01)
          </p>
        </div>
      )}

      {/* Test 2: Runs Test */}
      {runs && (
        <div className="test-card" id="test-runs-card">
          <div className="test-header">
            <span className="test-name">2. Runs Test (Transitions)</span>
            <span className={runs.passed ? 'badge-pass' : 'badge-fail'}>
              {runs.passed ? 'PASSED' : 'CHECK FAILED'}
            </span>
          </div>

          <div className="test-metrics-row">
            <div className="test-metric">
              <div className="test-metric-label">Total Runs (Vn)</div>
              <div className="test-metric-val">{runs.totalRuns}</div>
            </div>
            <div className="test-metric">
              <div className="test-metric-label">P-Value</div>
              <div className="test-metric-val" style={{ color: runs.passed ? '#34d399' : '#f43f5e' }}>
                {runs.pValue}
              </div>
            </div>
            <div className="test-metric">
              <div className="test-metric-label">Threshold</div>
              <div className="test-metric-val">α = 0.01</div>
            </div>
          </div>

          <p className="test-conclusion">
            {runs.conclusion}
          </p>
        </div>
      )}

      {/* Shannon Entropy Metric */}
      <div className="test-card" id="test-entropy-card">
        <div className="test-header">
          <span className="test-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Gauge size={16} />
            3. Shannon Information Entropy
          </span>
          <span className="badge-pass">
            {entropy >= 0.95 ? 'OPTIMAL' : 'MODERATE'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-glow)' }}>
            {entropy}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            / {idealEntropy.toFixed(4)} bits of entropy per generated bit
          </span>
        </div>
        <p className="test-conclusion">
          Maximum entropy for a binary source is 1.000 bit/bit when P(0)=P(1)=0.5.
        </p>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 10 }}>
        Note: The frequency test demonstrates basic statistical randomness. Passing these tests is necessary but does not alone guarantee cryptographic unbreakability.
      </div>
    </div>
  );
}
