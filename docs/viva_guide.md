# Quantum Random Number Generator (QRNG) - Capstone Viva & Theory Guide

This document contains full theoretical explanations, mathematical derivations, circuit architecture notes, and high-yield questions for project viva defense.

---

## 1. Project Overview & Working Mechanism

### Why QRNG instead of PRNG?
- **PRNG (Pseudorandom Number Generators)**:
  - Standard algorithmic functions (`Math.random()`, Python's `random.random()`, Mersenne Twister MT19937, LCG) use deterministic arithmetic.
  - Given the initial seed or $k$ consecutive outputs, an attacker can reconstruct the internal state matrix and 100% predict all future and past numbers.
- **QRNG (Quantum Random Number Generators)**:
  - Exploits the foundational physical indeterminism of quantum mechanics (Born's Rule).
  - Measurement of a quantum superposition is provably non-deterministic according to Bell's theorem and the Kochen-Specker theorem (no local hidden variables).

---

## 2. Mathematical Foundation of the Circuit

### Step 1: Qubit Initialization
The quantum register starts in the ground state:
$$\vert 0 \rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$$

### Step 2: Applying the Hadamard ($H$) Gate
The Hadamard gate is a single-qubit unitary operator represented by the matrix:
$$H = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$$

Applying $H$ to $\vert 0 \rangle$:
$$H \vert 0 \rangle = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} \begin{pmatrix} 1 \\ 0 \end{pmatrix} = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 \\ 1 \end{pmatrix} = \frac{\vert 0 \rangle + \vert 1 \rangle}{\sqrt{2}} = \vert + \rangle$$

The qubit is now in an equal superposition with equal probability amplitudes $\alpha = \frac{1}{\sqrt{2}}$ and $\beta = \frac{1}{\sqrt{2}}$.

### Step 3: Projective Measurement (Born's Rule)
Measurement in the computational basis $\{\vert 0 \rangle, \vert 1 \rangle\}$ projects the superposition into an eigenstate:
$$P(0) = \vert \langle 0 \vert + \rangle \vert^2 = \left\vert \frac{1}{\sqrt{2}} \right\vert^2 = \frac{1}{2} = 50\%$$
$$P(1) = \vert \langle 1 \vert + \rangle \vert^2 = \left\vert \frac{1}{\sqrt{2}} \right\vert^2 = \frac{1}{2} = 50\%$$

Upon measurement, the quantum wavefunction collapses irreversibly to classical bit $c \in \{0, 1\}$.

---

## 3. Circuit Representation & OpenQASM 2.0

### ASCII Diagram
```text
     ┌───┐ ░ ┌─┐
q: ──┤ H ├─░─┤M├───
     └───┘ ░ └╥┘
c: ═══════════╩════
```

### OpenQASM 2.0
```qasm
OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
h q[0];
measure q[0] -> c[0];
```

---

## 4. Statistical Testing (NIST SP 800-22)

### 1. Frequency (Monobit) Test
- **Purpose**: Verifies if the proportion of 0s and 1s in sequence $\epsilon$ of length $n$ is approximately equal.
- **Conversion**: $X_i = 2\epsilon_i - 1 \in \{-1, +1\}$.
- **Sum**: $S_n = \sum_{i=1}^n X_i = \text{ones} - \text{zeros}$.
- **Test Statistic**: $S_{obs} = \frac{\vert S_n \vert}{\sqrt{n}}$.
- **P-Value**: Computed using the complementary error function:
  $$P\text{-value} = \text{erfc}\left(\frac{S_{obs}}{\sqrt{2}}\right)$$
- **Decision Rule**: If $P\text{-value} \ge 0.01$, the sequence passes and is accepted as random.

### 2. Runs Test
- **Purpose**: Checks the number of transitions between consecutive bits to detect whether clustering or alternation occurs too frequently or too rarely.

### 3. Shannon Entropy
$$H(X) = -\sum_{i \in \{0, 1\}} P(x_i) \log_2 P(x_i)$$
- When $P(0) = P(1) = 0.5$:
  $$H(X) = -(0.5 \log_2 0.5 + 0.5 \log_2 0.5) = 1.0000 \text{ bits/bit (Optimal Maximum)}$$

---

## 5. Architectural Transparency Notice (ARCHITECTURE.md Section 19)

> **"This implementation demonstrates quantum random number generation using a simulated quantum circuit. Physical quantum randomness requires execution on real quantum hardware."**

- When run on **Qiskit `StatevectorSampler`**, the probability amplitudes are computed analytically from unitary matrices, and measurement sampling uses a computer's statevector backend.
- When connected to **IBM Quantum Hardware**, superconducting transmon qubits physically experience quantum fluctuations, producing physical quantum entropy.
