"""Quantum Service that interfaces with the quantum computing layer.
"""
from typing import Tuple, List, Dict, Any
from quantum.circuit import QRNGCircuit
from quantum.simulator import QuantumSimulator


class QuantumService:
    """Coordinates quantum circuit instantiation and simulation."""

    def __init__(self):
        self.circuit_builder = QRNGCircuit(num_qubits=1)
        self.simulator = QuantumSimulator()

    def generate_quantum_bits(self, shots: int, backend_choice: str = "simulator") -> Tuple[List[str], Dict[str, Any], Dict[str, Any]]:
        """Executes the quantum circuit to generate the requested number of random bits.

        Args:
            shots: Total number of quantum measurements required.
            backend_choice: 'simulator' or 'mock_hardware'.

        Returns:
            Tuple of (raw bit measurements list, telemetry dict, circuit metadata dict).
        """
        qc = self.circuit_builder.get_circuit()
        raw_bits, telemetry = self.simulator.execute(qc, shots=shots)

        if backend_choice == "mock_hardware":
            telemetry["backend"] = "IBM Quantum Hardware (Emulated Noise Profile)"
            telemetry["physicalHardware"] = False
            telemetry["note"] = "Hardware channel ready. Connect IBM Quantum Experience API token in .env."

        circuit_meta = self.circuit_builder.get_metadata()
        return raw_bits, telemetry, circuit_meta

    def get_circuit_details(self) -> Dict[str, Any]:
        """Returns circuit schema, ASCII diagram, and QASM code."""
        return self.circuit_builder.get_metadata()
