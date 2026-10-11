"""Controller for QRNG endpoints.
Coordinates request validation, service execution, and standardized responses.
"""
from typing import Dict, Any
from backend.utils.validation import validate_qrng_request
from backend.services.qrng_service import QRNGService


class QRNGController:
    """Handles HTTP controller actions for QRNG operations."""

    def __init__(self):
        self.service = QRNGService()

    def generate(self, bits: Any, backend: str = "simulator") -> Dict[str, Any]:
        """Validates request and generates quantum random bits.

        Args:
            bits: Requested number of bits.
            backend: Target backend name.

        Returns:
            JSON response conforming to ARCHITECTURE.md.
        """
        validated = validate_qrng_request(bits=bits, backend=backend)
        return self.service.generate(
            bits=validated["bits"],
            backend=validated["backend"]
        )

    def get_circuit(self) -> Dict[str, Any]:
        """Returns circuit diagrams and metadata."""
        circuit_info = self.service.get_circuit_info()
        return {
            "success": True,
            "circuit": circuit_info
        }

    def get_info(self) -> Dict[str, Any]:
        """Provides theoretical background, differences between PRNG and QRNG, and Viva notes."""
        return {
            "success": True,
            "project": "Quantum Random Number Generator (QRNG)",
            "principles": {
                "superposition": (
                    "A qubit initially in state |0⟩ is transformed by a Hadamard (H) gate into an equal "
                    "superposition (|0⟩ + |1⟩)/√2. In this state, the qubit exists simultaneously in both basis states."
                ),
                "bornRule": (
                    "Born's Rule states that the probability of measuring state |x⟩ is given by |⟨x|ψ⟩|². "
                    "For (|0⟩ + |1⟩)/√2, P(0) = |1/√2|² = 0.5 and P(1) = |1/√2|² = 0.5."
                ),
                "measurementCollapse": (
                    "Upon interaction with a macroscopic measurement apparatus, the quantum superposition collapses "
                    "irreversibly and indeterministically to either classical bit 0 or 1."
                ),
                "prngVsQrng": {
                    "prng": "Pseudorandom algorithms (e.g. Mersenne Twister, LCG) are deterministic. Given the seed and state, all future outputs are 100% predictable.",
                    "qrng": "Quantum random number generation relies on fundamental physical indeterminism. Output bits are genuinely unpredictable."
                }
            },
            "disclaimer": (
                "This implementation demonstrates quantum random number generation using a simulated quantum circuit. "
                "Physical quantum randomness requires execution on real quantum hardware."
            )
        }
