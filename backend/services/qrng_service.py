"""High-level QRNG service combining quantum measurement with statistical analysis.
"""
from typing import Dict, Any
from quantum.measurement import MeasurementProcessor
from backend.services.quantum_service import QuantumService
from backend.services.statistics_service import StatisticsService


class QRNGService:
    """Coordinates generation, processing, and statistical validation of quantum random bits."""

    def __init__(self):
        self.quantum_service = QuantumService()

    def generate(self, bits: int, backend: str = "simulator") -> Dict[str, Any]:
        """Runs the quantum pipeline to generate bits and calculate statistics.

        Args:
            bits: Number of bits requested.
            backend: The target backend name.

        Returns:
            Complete QRNG payload conforming to ARCHITECTURE.md specifications.
        """
        # 1. Execute quantum circuit
        raw_bits, telemetry, circuit_meta = self.quantum_service.generate_quantum_bits(
            shots=bits, backend_choice=backend
        )

        # 2. Process and clean measurement sequence
        measurement_data = MeasurementProcessor.process_raw_measurements(raw_bits, expected_bits=bits)
        bit_seq = measurement_data["bitSequence"]

        # 3. Calculate statistics and randomness tests
        stats_data = StatisticsService.analyze_sequence(bit_seq)

        # 4. Assemble final response conforming to ARCHITECTURE.md Section 11
        response = {
            "success": True,
            "bits": bit_seq,
            "totalBits": measurement_data["totalBits"],
            "zeros": measurement_data["zeros"],
            "ones": measurement_data["ones"],
            "zeroPercentage": measurement_data["zeroPercentage"],
            "onePercentage": measurement_data["onePercentage"],
            "deltaFromIdeal": stats_data["deltaFromIdeal"],
            "decimalValue": stats_data["decimalValue"],
            "hexValue": stats_data["hexValue"],
            "entropy": stats_data["entropy"],
            "idealEntropy": stats_data["idealEntropy"],
            "randomnessTest": {
                "monobit": stats_data["monobitTest"],
                "runs": stats_data["runsTest"]
            },
            "circuit": {
                "ascii": circuit_meta["ascii"],
                "qasm": circuit_meta["qasm"],
                "numQubits": circuit_meta["numQubits"],
                "gateCounts": circuit_meta["gateCounts"],
                "depth": circuit_meta["depth"],
                "theoreticalSuperposition": circuit_meta["theoreticalSuperposition"]
            },
            "telemetry": telemetry
        }

        return response

    def get_circuit_info(self) -> Dict[str, Any]:
        """Provides circuit metadata without generating bits."""
        return self.quantum_service.get_circuit_details()
