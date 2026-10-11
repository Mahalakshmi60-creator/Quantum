# Quantum Random Number Generator (QRNG)

## System Architecture

### 1. Project Overview

This project implements a basic **Quantum Random Number Generator (QRNG)** using a quantum circuit based on **superposition and measurement**.

The system generates random bits by:

1. Initializing a qubit in the `|0⟩` state.
2. Applying a Hadamard (`H`) gate.
3. Creating an equal superposition of `|0⟩` and `|1⟩`.
4. Measuring the qubit.
5. Using the measurement result (`0` or `1`) as a random bit.
6. Repeating the process to generate a sequence of random bits.
7. Performing basic statistical analysis on the generated sequence.

---

# 2. High-Level Architecture

```text
                         ┌─────────────────────────┐
                         │        USER             │
                         │                         │
                         │  Select number of bits  │
                         │  Generate QRNG          │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      FRONTEND           │
                         │                         │
                         │  QRNG Dashboard         │
                         │  Bit Input              │
                         │  Results Display        │
                         │  Circuit Visualization  │
                         │  Statistics             │
                         │  Charts                 │
                         └────────────┬────────────┘
                                      │
                              HTTP / API Request
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       BACKEND           │
                         │                         │
                         │  API Layer              │
                         │  Input Validation       │
                         │  QRNG Service           │
                         │  Result Processing      │
                         └────────────┬────────────┘
                                      │
                                      ▼
                   ┌────────────────────────────────────┐
                   │       QUANTUM COMPUTING LAYER      │
                   │                                    │
                   │  Create Quantum Circuit            │
                   │            ↓                       │
                   │  Initialize |0⟩                    │
                   │            ↓                       │
                   │  Apply Hadamard Gate               │
                   │            ↓                       │
                   │  Create Superposition              │
                   │            ↓                       │
                   │  Measure Qubit                     │
                   │            ↓                       │
                   │  Obtain 0 / 1                      │
                   └────────────────┬───────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────────┐
                         │    RESULT PROCESSING    │
                         │                         │
                         │  Bit Sequence           │
                         │  0/1 Counts             │
                         │  Percentages            │
                         │  Randomness Test        │
                         │  Decimal Conversion     │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │        FRONTEND         │
                         │                         │
                         │  Display Random Bits    │
                         │  Display Statistics     │
                         │  Display Circuit        │
                         │  Display Charts         │
                         └─────────────────────────┘
```

---

# 3. System Components

The system consists of five major layers.

```text
┌─────────────────────────────────────────────┐
│                Presentation Layer           │
│              Frontend / Dashboard           │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│                  API Layer                  │
│              REST API / Requests            │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│               Application Layer             │
│          QRNG Service / Processing          │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│             Quantum Computing Layer         │
│       Quantum Circuit + Measurement         │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Analysis Layer                 │
│     Statistics / Randomness / Conversion    │
└─────────────────────────────────────────────┘
```

---

# 4. Frontend Architecture

The frontend provides the user interface for interacting with the QRNG.

### Main Components

```text
Frontend
│
├── Dashboard
│
├── QRNG Generator
│   ├── Bit Count Input
│   ├── Generate Button
│   └── Reset Button
│
├── Random Output
│   ├── Binary Sequence
│   ├── Decimal Value
│   └── Copy Button
│
├── Quantum Circuit
│   └── Circuit Visualization
│
├── Measurement Statistics
│   ├── Number of 0s
│   ├── Number of 1s
│   ├── 0 Percentage
│   └── 1 Percentage
│
├── Randomness Analysis
│   └── Frequency / Monobit Test
│
└── Explanation
    ├── Superposition
    ├── Hadamard Gate
    └── Measurement
```

### Frontend Responsibilities

The frontend should:

* Accept the required number of random bits.
* Validate user input.
* Send a request to the backend.
* Display the generated sequence.
* Display quantum-circuit information.
* Display measurement statistics.
* Display charts.
* Display basic randomness analysis.
* Allow users to copy generated results.
* Handle loading and error states.

The frontend must **not generate the random bits itself**.

---

# 5. Backend Architecture

The backend acts as the bridge between the frontend and quantum computing layer.

```text
Backend
│
├── API Routes
│
├── Request Validation
│
├── QRNG Controller
│
├── QRNG Service
│
├── Quantum Circuit Service
│
├── Statistical Analysis Service
│
└── Response Formatter
```

### Backend Responsibilities

The backend should:

1. Receive the requested bit count.
2. Validate the request.
3. Create the quantum circuit.
4. Execute the quantum circuit.
5. Collect measurement results.
6. Convert measurements into a binary sequence.
7. Calculate statistics.
8. Perform basic randomness analysis.
9. Return the result to the frontend.

---

# 6. Quantum Computing Architecture

The quantum layer is the core of the project.

## Basic Circuit

```text
       ┌───┐ ░ ┌─┐
q: ────┤ H ├─░─┤M├────
       └───┘ ░ └╥┘
               ║
c: ════════════╩════
```

Conceptually:

```text
|0⟩
 │
 ▼
Hadamard Gate
 │
 ▼
(|0⟩ + |1⟩) / √2
 │
 ▼
Measurement
 │
 ├──── 0
 │
 └──── 1
```

The Hadamard operation transforms:

```text
|0⟩ → (|0⟩ + |1⟩) / √2
```

Therefore:

```text
P(0) = 0.5
P(1) = 0.5
```

Measurement produces one of the two outcomes.

---

# 7. Random Bit Generation

For `N` requested bits:

```text
User
 │
 ▼
N = Number of requested bits
 │
 ▼
Create quantum circuit
 │
 ▼
Apply H gate
 │
 ▼
Measure
 │
 ▼
0 or 1
 │
 ▼
Repeat / execute N shots
 │
 ▼
Random Bit Sequence
```

Example:

```text
Requested bits: 8

Quantum measurements:

0 1 1 0 1 0 0 1

Generated sequence:

01101001
```

The sequence must be obtained from actual quantum measurement results.

Do **not** use:

```text
Math.random()
random.random()
```

or equivalent pseudorandom functions as the source of QRNG bits.

---

# 8. Measurement Statistics

For every QRNG execution, calculate:

```text
Total Bits
Number of 0s
Number of 1s
Percentage of 0s
Percentage of 1s
```

Example:

```text
Total Bits : 1000
Zeros      : 497
Ones       : 503

0 Percentage : 49.7%
1 Percentage : 50.3%
```

The results should generally approach a 50/50 distribution with increasing numbers of measurements.

However, an exact 50/50 distribution is **not required** for a genuinely random sequence.

---

# 9. Randomness Analysis

The project should include basic statistical analysis.

## Frequency / Monobit Test

Count:

```text
Number of 0s
Number of 1s
```

Calculate:

```text
Zero Ratio = Number of 0s / Total Bits

One Ratio = Number of 1s / Total Bits
```

Display the result graphically.

Example:

```text
         Measurement Distribution

0  ████████████████████████  49.7%

1  █████████████████████████ 50.3%
```

The system should describe this as a **basic randomness demonstration**.

Passing a simple frequency test must not be interpreted as proof of cryptographic security.

---

# 10. Binary-to-Decimal Conversion

The generated binary sequence may be converted to a decimal number.

Example:

```text
Binary:

01101001

Decimal:

105
```

For an `N`-bit sequence:

```text
Decimal Value = Binary-to-Decimal Conversion
```

The conversion is deterministic and occurs **after** the quantum random bits have been generated.

---

# 11. API Architecture

A simple REST API can be used.

## Generate Random Bits

```http
POST /api/qrng/generate
```

### Request

```json
{
  "bits": 128
}
```

### Response

```json
{
  "success": true,
  "bits": "0110100111010010...",
  "totalBits": 128,
  "zeros": 63,
  "ones": 65,
  "zeroPercentage": 49.22,
  "onePercentage": 50.78,
  "decimalValue": 13746
}
```

The exact response structure should follow the existing repository architecture if an API already exists.

---

# 12. Data Flow

```text
USER
 │
 │ Select number of bits
 ▼
FRONTEND
 │
 │ POST /api/qrng/generate
 ▼
BACKEND API
 │
 │ Validate input
 ▼
QRNG SERVICE
 │
 ▼
QUANTUM CIRCUIT
 │
 │ H Gate
 ▼
SUPERPOSITION
 │
 ▼
MEASUREMENT
 │
 │ 0 / 1
 ▼
BIT SEQUENCE
 │
 ├───────────────┐
 │               │
 ▼               ▼
STATISTICS    DECIMAL
 │            CONVERSION
 ▼               │
RANDOMNESS       │
ANALYSIS         │
 │               │
 └───────┬───────┘
         ▼
       JSON
         │
         ▼
      FRONTEND
         │
         ▼
      DASHBOARD
```

---

# 13. Optional Quantum Backend Architecture

The system should support a local quantum simulator by default.

```text
QRNG Service
     │
     ├──────────────► Local Quantum Simulator
     │
     │
     └──────────────► Real Quantum Backend
                       (Optional)
```

The architecture should make it possible to add real quantum hardware later.

If a cloud quantum provider is used, credentials must be stored using environment variables.

Never hardcode API keys or tokens.

The application must clearly identify whether the result was produced by:

```text
Quantum Simulator
```

or:

```text
Real Quantum Hardware
```

---

# 14. Error Handling Architecture

```text
User Input
    │
    ▼
Validation
    │
    ├── Invalid ──► Error Message
    │
    ▼
Quantum Execution
    │
    ├── Failure ──► Backend Error
    │
    ▼
Result Processing
    │
    ├── Invalid Result ──► Processing Error
    │
    ▼
Successful Response
```

Possible errors:

* Invalid bit count
* Missing input
* Bit count outside allowed range
* Quantum circuit execution failure
* Backend unavailable
* Simulator failure
* API failure
* Unexpected measurement response

---

# 15. Suggested Project Structure

Adapt this structure to the existing repository rather than blindly replacing the current structure.

```text
qrng-project/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRNGGenerator
│   │   │   ├── QuantumCircuit
│   │   │   ├── ResultsDisplay
│   │   │   ├── Statistics
│   │   │   └── RandomnessAnalysis
│   │   │
│   │   ├── pages/
│   │   │   └── Dashboard
│   │   │
│   │   ├── services/
│   │   │   └── qrngApi
│   │   │
│   │   └── App
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── routes/
│   │   └── qrng
│   │
│   ├── controllers/
│   │   └── qrngController
│   │
│   ├── services/
│   │   ├── qrngService
│   │   ├── quantumService
│   │   └── statisticsService
│   │
│   ├── utils/
│   │   └── validation
│   │
│   ├── tests/
│   │
│   └── requirements.txt
│
├── quantum/
│   │
│   ├── qrngCircuit
│   ├── measurement
│   └── simulator
│
├── docs/
│   └── quantum-concepts
│
├── README.md
├── ARCHITECTURE.md
└── .env.example
```

The actual folder structure should be adapted to the technologies already present in the GitHub repository.

---

# 16. Technology Layer

The exact technology stack should be determined from the existing repository.

A recommended architecture is:

```text
Frontend
    ↓
React / Existing Frontend Framework
    ↓
REST API
    ↓
Python Backend
    ↓
Qiskit
    ↓
Quantum Simulator / Quantum Hardware
```

Possible components:

| Layer              | Recommended Technology              |
| ------------------ | ----------------------------------- |
| Frontend           | React                               |
| Styling            | CSS / Tailwind CSS                  |
| Backend            | Python + FastAPI                    |
| Quantum Computing  | Qiskit                              |
| Quantum Simulation | Qiskit Aer / available simulator    |
| Charts             | Chart.js / Recharts                 |
| API                | REST                                |
| Testing            | Pytest + frontend testing framework |

**Do not introduce these technologies automatically if the existing repository already uses a different suitable stack.**

---

# 17. Security Architecture

The project should follow basic security practices.

```text
Frontend
   │
   ▼
Input Validation
   │
   ▼
Backend Validation
   │
   ▼
Quantum Service
```

Security requirements:

* Validate all input.
* Limit maximum requested bits.
* Never expose API keys.
* Use `.env` for secrets.
* Add `.env` to `.gitignore`.
* Use `.env.example` for documentation.
* Sanitize API inputs.
* Return safe error messages.

---

# 18. Scalability

The architecture should allow future extensions such as:

```text
Basic QRNG
    │
    ├── Multiple Qubits
    │
    ├── Different Quantum Circuits
    │
    ├── Real Quantum Hardware
    │
    ├── Advanced Randomness Tests
    │
    ├── QRNG History
    │
    ├── Download Results
    │
    ├── API Access
    │
    └── Cryptographic Applications
```

These are future extensions and should not be implemented unnecessarily unless required.

---

# 19. Important Technical Principle

The most important architectural rule is:

```text
                 QUANTUM CIRCUIT
                       │
                       ▼
                  MEASUREMENT
                       │
                       ▼
                  RANDOM 0 / 1
                       │
                       ▼
                 RANDOM BIT
```

The project must not fake quantum randomness.

The random bits displayed to the user must originate from the measurement results of the quantum circuit.

If a simulator is used, the project should clearly state:

> "This implementation demonstrates quantum random number generation using a simulated quantum circuit. Physical quantum randomness requires execution on real quantum hardware."

---

# 20. Final Architecture Goal

The final system should provide a complete demonstration of:

```text
              QUANTUM RANDOM NUMBER GENERATOR
                           │
                           ▼
                    Qubit |0⟩
                           │
                           ▼
                    Hadamard Gate
                           │
                           ▼
                     Superposition
                           │
                           ▼
                      Measurement
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                    0             1
                    │             │
                    └──────┬──────┘
                           ▼
                    Random Bit
                           │
                           ▼
                  N Random Measurements
                           │
                           ▼
                    Bit Sequence
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Statistics     Randomness    Decimal
                         Analysis     Conversion
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                       Dashboard
```

The final implementation should prioritize **correct quantum computation, clear architecture, reproducibility, maintainability, and ease of explanation during the capstone viva**.
