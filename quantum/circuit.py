"""Quantum Circuit builder for the Quantum Random Number Generator (QRNG).

Implements the fundamental quantum superposition circuit:
|0⟩ ──[ H ]──░──[ M ]──
             ░    ║
c ════════════════╩════
"""
from typing import Dict, Any
from qiskit import QuantumCircuit, qasm2


class QRNGCircuit:
    """Constructs and describes the quantum circuit used for random bit generation."""

    def __init__(self, num_qubits: int = 1):
        self.num_qubits = num_qubits
        self.circuit = self._build()

    def _build(self) -> QuantumCircuit:
        """Constructs a 1-qubit, 1-classical-bit QRNG circuit."""
        qc = QuantumCircuit(self.num_qubits, self.num_qubits, name="QRNG_Superposition")
        for i in range(self.num_qubits):
            # Step 1: Initial state is |0⟩
            # Step 2: Apply Hadamard gate to create equal superposition (|0⟩ + |1⟩) / √2
            qc.h(i)
            # Step 3: Measure the qubit into classical register
            qc.measure(i, i)
        return qc

    def get_circuit(self) -> QuantumCircuit:
        """Returns the underlying Qiskit QuantumCircuit instance."""
        return self.circuit

    def get_ascii_diagram(self) -> str:
        """Returns the text/ASCII diagram of the quantum circuit."""
        try:
            return str(self.circuit.draw(output="text"))
        except Exception:
            return "q: ──[ H ]──░──[ M ]──\nc: ══════════════╩════"

    def get_qasm(self) -> str:
        """Exports the quantum circuit in OpenQASM 2.0 format."""
        try:
            return qasm2.dumps(self.circuit)
        except Exception:
            return (
                "OPENQASM 2.0;\n"
                'include "qelib1.inc";\n'
                f"qreg q[{self.num_qubits}];\n"
                f"creg c[{self.num_qubits}];\n"
                "h q[0];\n"
                "measure q[0] -> c[0];\n"
            )

    def get_metadata(self) -> Dict[str, Any]:
        """Returns metadata about the quantum circuit architecture."""
        return {
            "numQubits": self.num_qubits,
            "numClassicalBits": self.num_qubits,
            "depth": self.circuit.depth(),
            "gateCounts": dict(self.circuit.count_ops()),
            "theoreticalSuperposition": "1/√2 (|0⟩ + |1⟩)",
            "theoreticalZeroProbability": 0.5,
            "theoreticalOneProbability": 0.5,
            "ascii": self.get_ascii_diagram(),
            "qasm": self.get_qasm()
        }
