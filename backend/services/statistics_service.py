"""Statistical analysis service for quantum random number sequences.
Implements standard randomness assessments including NIST SP 800-22 Monobit and Runs tests,
Shannon entropy, and deterministic base conversions.
"""
import math
from typing import Dict, Any


class StatisticsService:
    """Computes statistical metrics and randomness evaluations for binary sequences."""

    @staticmethod
    def analyze_sequence(bits: str) -> Dict[str, Any]:
        """Performs complete statistical evaluation of a binary sequence.

        Args:
            bits: A binary string composed of '0' and '1'.

        Returns:
            Dictionary containing counts, percentages, conversions, and randomness test results.
        """
        n = len(bits)
        if n == 0:
            return {
                "totalBits": 0,
                "zeros": 0,
                "ones": 0,
                "zeroPercentage": 0.0,
                "onePercentage": 0.0,
                "deltaFromIdeal": 0.0,
                "decimalValue": "0",
                "hexValue": "0x0",
                "entropy": 0.0,
                "monobitTest": {},
                "runsTest": {}
            }

        zeros = bits.count("0")
        ones = bits.count("1")
        zero_pct = round((zeros / n) * 100, 2)
        one_pct = round((ones / n) * 100, 2)
        delta_ideal = round(abs(50.0 - zero_pct), 2)

        # Base conversions
        try:
            dec_val = str(int(bits, 2))
            hex_val = hex(int(bits, 2))
        except ValueError:
            dec_val = "0"
            hex_val = "0x0"

        # Shannon Entropy (ideal is 1.0000 bit per bit)
        p0 = zeros / n
        p1 = ones / n
        entropy = 0.0
        if p0 > 0:
            entropy -= p0 * math.log2(p0)
        if p1 > 0:
            entropy -= p1 * math.log2(p1)
        entropy = round(entropy, 4)

        # 1. NIST SP 800-22 Frequency (Monobit) Test
        monobit_results = StatisticsService.monobit_frequency_test(zeros, ones, n)

        # 2. Runs Test (NIST SP 800-22)
        runs_results = StatisticsService.runs_test(bits, ones, n)

        return {
            "totalBits": n,
            "zeros": zeros,
            "ones": ones,
            "zeroPercentage": zero_pct,
            "onePercentage": one_pct,
            "deltaFromIdeal": delta_ideal,
            "decimalValue": dec_val,
            "hexValue": hex_val,
            "entropy": entropy,
            "idealEntropy": 1.0,
            "monobitTest": monobit_results,
            "runsTest": runs_results
        }

    @staticmethod
    def monobit_frequency_test(zeros: int, ones: int, n: int) -> Dict[str, Any]:
        """Calculates the NIST SP 800-22 Frequency (Monobit) Test.

        The test checks whether the number of ones and zeros are approximately equal.
        S_n = sum(2 * bit - 1) = ones - zeros
        S_obs = |S_n| / sqrt(n)
        P_value = erfc(S_obs / sqrt(2))
        """
        s_n = ones - zeros
        s_obs = abs(s_n) / math.sqrt(n)
        p_value = math.erfc(s_obs / math.sqrt(2))
        p_value = round(p_value, 5)

        # In NIST SP 800-22, significance level alpha is 0.01
        passed = p_value >= 0.01

        conclusion = (
            "Sequence passes Frequency (Monobit) test. Proportions of 0s and 1s conform to a random distribution."
            if passed
            else "Sequence deviates from expected 50/50 balance beyond the 0.01 significance threshold."
        )

        return {
            "testName": "NIST SP 800-22 Frequency (Monobit) Test",
            "s_n": s_n,
            "s_obs": round(s_obs, 4),
            "pValue": p_value,
            "threshold": 0.01,
            "passed": passed,
            "conclusion": conclusion
        }

    @staticmethod
    def runs_test(bits: str, ones: int, n: int) -> Dict[str, Any]:
        """Calculates the NIST SP 800-22 Runs Test.

        Tests whether the number of runs of consecutive ones and zeros is as expected for a random sequence.
        """
        if n < 4:
            return {
                "testName": "NIST SP 800-22 Runs Test",
                "totalRuns": 1,
                "pValue": 1.0,
                "passed": True,
                "conclusion": "Sample size too small for full runs test; automatically assumed valid."
            }

        pi = ones / n
        # Pre-test condition
        if abs(pi - 0.5) >= (2.0 / math.sqrt(n)):
            return {
                "testName": "NIST SP 800-22 Runs Test",
                "totalRuns": 0,
                "pValue": 0.0,
                "passed": False,
                "conclusion": "Pre-test frequency check failed: sequence ratio is too far from 0.5."
            }

        # Calculate total runs V_n
        v_n = 1 + sum(1 for i in range(n - 1) if bits[i] != bits[i + 1])

        # Compute P-value
        numerator = abs(v_n - 2.0 * n * pi * (1.0 - pi))
        denominator = 2.0 * math.sqrt(2.0 * n) * pi * (1.0 - pi)
        if denominator == 0:
            p_value = 0.0
        else:
            p_value = round(math.erfc(numerator / denominator), 5)

        passed = p_value >= 0.01

        return {
            "testName": "NIST SP 800-22 Runs Test",
            "totalRuns": v_n,
            "pValue": p_value,
            "threshold": 0.01,
            "passed": passed,
            "conclusion": (
                "Sequence passes the Runs Test; no abnormal bit clustering detected."
                if passed
                else "Unusual clustering or alternation frequency detected."
            )
        }
