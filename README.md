# Quantum Random Number Generator (QRNG)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://mahalakshmi60-creator.github.io/Quantum/)

A full-stack, research-grade **Quantum Random Number Generator (QRNG)** built with **Qiskit 2.5**, **FastAPI**, and **React**.

- **Live Public URL**: [https://mahalakshmi60-creator.github.io/Quantum/](https://mahalakshmi60-creator.github.io/Quantum/)

Designed and implemented in exact accordance with [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Key Features

- **True Quantum Circuit Simulation**: Single-qubit circuit utilizing the Hadamard gate ($H$) to generate true equal superposition $\frac{|0\rangle + |1\rangle}{\sqrt{2}}$ followed by projective measurement ($M$).
- **No Pseudorandom Shortcuts**: Every bit is sampled directly from Qiskit's `StatevectorSampler` primitives.
- **Real-Time Statistical Engine**:
  - **NIST SP 800-22 Frequency (Monobit) Test** with $S_n$, $S_{obs}$, and $P$-value ($\alpha = 0.01$).
  - **NIST SP 800-22 Runs Test** for detecting bit clustering and transition balance.
  - **Shannon Information Entropy** measurement (ideal = 1.000 bits/bit).
- **Deterministic Number Formats**: Arbitrary-precision Decimal (Base-10) and Hexadecimal (Base-16) conversion of generated bitstreams.
- **Interactive Quantum Circuit Visualizer**: Real-time circuit schematics, stage-by-stage mathematical wavefunction evolution, Qiskit ASCII drawing, and OpenQASM 2.0 code viewer.
- **Cyber-Quantum Dashboard**: Sleek dark aesthetic, glowing interactive bit chips, dynamic 0/1 distribution comparison bars, and export options (Copy, TXT, JSON).
- **Capstone Viva Mode**: In-app theoretical guide with high-yield viva questions, mathematical derivations, and PRNG vs QRNG comparative analysis.

---

## Architecture & Directory Structure

```text
Quantum/
├── backend/
│   ├── main.py                        # FastAPI application & CORS configuration
│   ├── requirements.txt               # Backend dependencies
│   ├── routes/
│   │   └── qrng.py                    # REST API routes (/generate, /circuit, /info)
│   ├── controllers/
│   │   └── qrng_controller.py         # Request validation & orchestration
│   ├── services/
│   │   ├── qrng_service.py            # High-level QRNG service
│   │   ├── quantum_service.py         # Qiskit circuit execution bridge
│   │   └── statistics_service.py      # NIST tests, entropy, and conversions
│   ├── utils/
│   │   └── validation.py              # Input validation (range 1-4096)
│   └── tests/
│       └── test_qrng.py               # Automated pytest suite (17 tests)
├── quantum/
│   ├── circuit.py                     # Quantum circuit definition (|0⟩ -> H -> Measure)
│   ├── simulator.py                   # StatevectorSampler execution
│   └── measurement.py                 # Shot measurement processor & validator
├── frontend/
│   ├── index.html                     # Web entry point with Google Fonts
│   ├── vite.config.js                 # Vite dev proxy configuration
│   ├── package.json                   # React + Lucide dependencies
│   └── src/
│       ├── App.jsx                    # Main dashboard shell
│       ├── index.css                  # Custom quantum glassmorphism styles
│       ├── services/
│       │   └── qrngApi.js             # Frontend API client
│       └── components/
│           ├── Navbar.jsx             # Top bar with live status indicator
│           ├── QRNGGenerator.jsx      # Bit count presets & generation controls
│           ├── ResultsDisplay.jsx     # Bit grid, raw stream, decimal, hex
│           ├── QuantumCircuit.jsx     # Visual circuit schematic & QASM
│           ├── Statistics.jsx         # 0/1 counts, percentages & delta
│           ├── RandomnessAnalysis.jsx # NIST Monobit, Runs test & entropy
│           └── EducationalPanel.jsx   # Capstone Viva & Theory Guide
├── docs/
│   └── viva_guide.md                  # Comprehensive viva reference document
├── .env.example                       # Environment configuration template
├── run_app.bat                        # Single-click launcher for Windows
└── ARCHITECTURE.md                    # System architecture specification
```

---

## Quickstart Guide

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 18+ and npm

### 1. Start the FastAPI Backend
```powershell
# In the project root:
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation is interactively available at `http://localhost:8000/docs`.

### 2. Start the Frontend Dashboard
```powershell
# Open a new terminal in the frontend directory:
npm.cmd --prefix frontend run dev
```
Open `http://localhost:5173` in your browser.

---

## Running Automated Tests

Run the backend test suite:
```powershell
python -m pytest backend/tests/test_qrng.py -v
```

---

## API Reference

### `POST /api/qrng/generate`
Generates $N$ quantum random bits and calculates statistics.

**Request:**
```json
{
  "bits": 128,
  "backend": "simulator"
}
```

**Response:**
```json
{
  "success": true,
  "bits": "011010011101...",
  "totalBits": 128,
  "zeros": 63,
  "ones": 65,
  "zeroPercentage": 49.22,
  "onePercentage": 50.78,
  "deltaFromIdeal": 0.78,
  "decimalValue": "140819...",
  "hexValue": "0x8fa...",
  "entropy": 0.9998,
  "randomnessTest": {
    "monobit": {
      "testName": "NIST SP 800-22 Frequency (Monobit) Test",
      "s_obs": 0.1768,
      "pValue": 0.8596,
      "passed": true
    },
    "runs": {
      "testName": "NIST SP 800-22 Runs Test",
      "totalRuns": 64,
      "pValue": 0.8712,
      "passed": true
    }
  },
  "circuit": {
    "ascii": "...",
    "qasm": "..."
  },
  "telemetry": {
    "backend": "Qiskit StatevectorSampler",
    "executionTimeMs": 14.2
  }
}
```

---

## Capstone Viva Reference

Refer to [docs/viva_guide.md](docs/viva_guide.md) or click the **"Viva & Theory Guide"** button in the dashboard for complete explanations of:
- Mathematical derivation of the Hadamard gate on $|0\rangle$.
- Born's Rule and wavefunction collapse.
- Deterministic PRNG seeds vs physical quantum indeterminism.
- NIST SP 800-22 hypothesis testing and $P$-value interpretations.
