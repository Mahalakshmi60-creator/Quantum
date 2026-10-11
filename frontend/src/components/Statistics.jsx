import React from 'react';
import { BarChart3, Activity, PieChart } from 'lucide-react';

export default function Statistics({ data }) {
  if (!data || !data.bits) {
    return null;
  }

  const { totalBits, zeros, ones, zeroPercentage, onePercentage, deltaFromIdeal } = data;

  return (
    <div className="glass-card" id="card-measurement-statistics">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart3 size={20} />
          Measurement Statistics
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Theoretical: P(0)=50%, P(1)=50%
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card" id="stat-card-total-bits">
          <div className="stat-label">Total Bits</div>
          <div className="stat-value">{totalBits}</div>
        </div>

        <div className="stat-card" id="stat-card-zeros">
          <div className="stat-label">Number of 0s</div>
          <div className="stat-value cyan">{zeros}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cyan-glow)' }}>{zeroPercentage}%</div>
        </div>

        <div className="stat-card" id="stat-card-ones">
          <div className="stat-label">Number of 1s</div>
          <div className="stat-value purple">{ones}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--purple-glow)' }}>{onePercentage}%</div>
        </div>

        <div className="stat-card" id="stat-card-delta">
          <div className="stat-label">Ideal Deviation</div>
          <div className="stat-value emerald">±{deltaFromIdeal}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>from 50.0%</div>
        </div>
      </div>

      {/* Distribution Comparison Bar */}
      <div className="dist-bar-wrapper">
        <div className="dist-bar-labels">
          <span style={{ color: 'var(--cyan-glow)' }}>
            |0⟩ State: {zeros} ({zeroPercentage}%)
          </span>
          <span style={{ color: 'var(--purple-glow)' }}>
            |1⟩ State: {ones} ({onePercentage}%)
          </span>
        </div>

        <div className="dist-bar-container" title={`0: ${zeroPercentage}% | 1: ${onePercentage}%`}>
          <div
            className="dist-bar-0"
            style={{ width: `${zeroPercentage}%` }}
          >
            {zeroPercentage > 15 ? `${zeroPercentage}%` : ''}
          </div>

          <div
            className="dist-bar-1"
            style={{ width: `${onePercentage}%` }}
          >
            {onePercentage > 15 ? `${onePercentage}%` : ''}
          </div>

          <div className="ideal-center-marker" title="Theoretical 50/50 Line" />
        </div>

        <div className="ideal-legend">
          ▲ White line denotes the theoretical 50.0% equiprobable superposition line
        </div>
      </div>
    </div>
  );
}
