import React from 'react';
import { BookOpen, Radio, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ backendHealthy, onOpenViva }) {
  return (
    <header className="navbar" id="qrng-navbar">
      <div className="container nav-content">
        <a href="#" className="brand" id="brand-link">
          <svg className="atom-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="8" fill="#00f2fe" />
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#00f2fe" strokeWidth="2.5" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#a855f7" strokeWidth="2.5" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="#38bdf8" strokeWidth="2.5" transform="rotate(90 50 50)" />
          </svg>
          <div className="brand-text">
            <h1>QUANTUM QRNG</h1>
          </div>
          <span className="brand-badge">Qiskit 2.5</span>
        </a>

        <div className="nav-actions">
          <div className="status-badge" id="backend-status-indicator" title="Connected to Local Quantum Simulation Engine">
            <span className={`status-indicator ${backendHealthy ? 'online' : 'offline'}`} />
            <span>{backendHealthy ? 'Qiskit Simulator Online' : 'Backend Offline'}</span>
          </div>

          <button
            type="button"
            className="btn-viva"
            id="btn-open-viva-modal"
            onClick={onOpenViva}
          >
            <BookOpen size={16} />
            <span>Viva & Theory Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}
