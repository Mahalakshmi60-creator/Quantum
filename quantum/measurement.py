"""Measurement processing and validation for QRNG outcomes.
"""
from typing import List, Dict, Any


class MeasurementProcessor:
    """Processes, cleans, and verifies raw measurement outcomes from quantum execution."""

    @staticmethod
    def process_raw_measurements(raw_measurements: List[str], expected_bits: int) -> Dict[str, Any]:
        """Combines shot outcomes into a continuous binary sequence and verifies integrity.

        Args:
            raw_measurements: List of individual shot bitstrings (e.g. ['0', '1', '0', ...])
            expected_bits: Expected total number of bits requested.

        Returns:
            Dict containing cleaned binary string, counts, and verification status.
        """
        # Strip whitespace and combine
        cleaned_bits = "".join(b.strip() for b in raw_measurements)

        # Truncate or check length
        if len(cleaned_bits) > expected_bits:
            cleaned_bits = cleaned_bits[:expected_bits]

        if len(cleaned_bits) != expected_bits:
            raise ValueError(
                f"Quantum measurement count mismatch: expected {expected_bits} bits, got {len(cleaned_bits)}"
            )

        # Integrity check: Ensure only '0' and '1'
        if not set(cleaned_bits).issubset({"0", "1"}):
            raise ValueError("Corrupted quantum measurement: non-binary character detected.")

        zeros_count = cleaned_bits.count("0")
        ones_count = cleaned_bits.count("1")

        return {
            "bitSequence": cleaned_bits,
            "totalBits": len(cleaned_bits),
            "zeros": zeros_count,
            "ones": ones_count,
            "zeroPercentage": round((zeros_count / len(cleaned_bits)) * 100, 2) if len(cleaned_bits) > 0 else 0.0,
            "onePercentage": round((ones_count / len(cleaned_bits)) * 100, 2) if len(cleaned_bits) > 0 else 0.0,
            "isValid": True
        }
