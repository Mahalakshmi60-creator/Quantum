"""Quantum Simulator interface for executing circuits using Qiskit 2.5 primitives.
"""
import time
from typing import List, Dict, Any, Tuple
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler


class QuantumSimulator:
    """Executes quantum circuits on a local quantum statevector simulator."""

    def __init__(self, seed: int = None):
        # StatevectorSampler supports exact quantum measurement sampling according to Born's Rule
        self.sampler = StatevectorSampler(seed=seed)
        self.backend_name = "Qiskit StatevectorSampler (Simulated Quantum Circuit)"

    def execute(self, circuit: QuantumCircuit, shots: int) -> Tuple[List[str], Dict[str, Any]]:
        """Executes the given quantum circuit for the specified number of shots.

        Args:
            circuit: The QuantumCircuit to execute.
            shots: Number of independent quantum measurements (shots).

        Returns:
            Tuple containing:
            - List of measurement outcomes (e.g. ['0', '1', '1', ...])
            - Telemetry dictionary with timing and backend info.
        """
        start_time = time.perf_counter()

        # Run the circuit on the StatevectorSampler
        job = self.sampler.run([circuit], shots=shots)
        result = job.result()
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Extract measurement results from classical register 'c'
        pub_result = result[0]
        # In Qiskit 2.x StatevectorSampler, classical registers are accessible on pub_result.data
        if hasattr(pub_result.data, "c"):
            bit_data = pub_result.data.c
        elif len(pub_result.data) > 0:
            # First classical register
            first_key = list(pub_result.data.keys())[0]
            bit_data = getattr(pub_result.data, first_key)
        else:
            raise RuntimeError("No measurement data found in quantum execution result.")

        # get_bitstrings() yields a list of shot measurement strings, e.g. ['0', '1', '0', ...]
        bitstrings: List[str] = bit_data.get_bitstrings()

        telemetry = {
            "backend": self.backend_name,
            "shots": shots,
            "executionTimeMs": elapsed_ms,
            "isSimulation": True,
            "physicalHardware": False,
            "disclaimer": (
                "This implementation demonstrates quantum random number generation using a simulated quantum circuit. "
                "Physical quantum randomness requires execution on real quantum hardware."
            )
        }

        return bitstrings, telemetry
