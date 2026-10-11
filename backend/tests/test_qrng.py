"""Automated test suite for Quantum Random Number Generator (QRNG).
Covers quantum layer, statistical engine, input validation, and API endpoints.
"""
import pytest
from fastapi.testclient import TestClient

from quantum.circuit import QRNGCircuit
from quantum.simulator import QuantumSimulator
from quantum.measurement import MeasurementProcessor
from backend.services.statistics_service import StatisticsService
from backend.services.qrng_service import QRNGService
from backend.utils.validation import validate_qrng_request
from backend.main import app

client = TestClient(app)


class TestQuantumLayer:
    """Tests for quantum circuit generation and simulation."""

    def test_circuit_construction(self):
        builder = QRNGCircuit(num_qubits=1)
        qc = builder.get_circuit()
        assert qc.num_qubits == 1
        assert qc.num_clbits == 1
        # Gate count check: 1 Hadamard, 1 Measure
        ops = dict(qc.count_ops())
        assert ops.get("h") == 1
        assert ops.get("measure") == 1

        ascii_diagram = builder.get_ascii_diagram()
        assert "H" in ascii_diagram
        qasm_str = builder.get_qasm()
        assert "OPENQASM" in qasm_str
        assert "h q[0];" in qasm_str

    def test_simulator_execution(self):
        builder = QRNGCircuit()
        sim = QuantumSimulator(seed=42)
        shots = 64
        raw_bits, telemetry = sim.execute(builder.get_circuit(), shots=shots)

        assert len(raw_bits) == shots
        assert all(b in {"0", "1"} for b in raw_bits)
        assert telemetry["shots"] == shots
        assert telemetry["isSimulation"] is True
        assert "executionTimeMs" in telemetry

    def test_measurement_processing(self):
        raw = ["0", "1", "1", "0", "1", "0", "0", "1"]
        processed = MeasurementProcessor.process_raw_measurements(raw, expected_bits=8)
        assert processed["bitSequence"] == "01101001"
        assert processed["totalBits"] == 8
        assert processed["zeros"] == 4
        assert processed["ones"] == 4
        assert processed["zeroPercentage"] == 50.0
        assert processed["onePercentage"] == 50.0
        assert processed["isValid"] is True

    def test_measurement_invalid_character(self):
        with pytest.raises(ValueError, match="non-binary character"):
            MeasurementProcessor.process_raw_measurements(["0", "2"], expected_bits=2)


class TestStatisticalEngine:
    """Tests for statistical analysis, NIST tests, and deterministic conversions."""

    def test_binary_to_decimal_conversion(self):
        # 01101001 binary is 105 in decimal
        bits = "01101001"
        analysis = StatisticsService.analyze_sequence(bits)
        assert analysis["decimalValue"] == "105"
        assert analysis["hexValue"] == hex(105)
        assert analysis["totalBits"] == 8
        assert analysis["zeros"] == 4
        assert analysis["ones"] == 4

    def test_monobit_test_balanced(self):
        # Perfectly balanced sequence
        res = StatisticsService.monobit_frequency_test(zeros=50, ones=50, n=100)
        assert res["s_n"] == 0
        assert res["s_obs"] == 0.0
        assert res["pValue"] == 1.0
        assert res["passed"] is True

    def test_monobit_test_skewed(self):
        # Highly skewed sequence (e.g. 95 zeros, 5 ones out of 100)
        res = StatisticsService.monobit_frequency_test(zeros=95, ones=5, n=100)
        assert res["s_obs"] == 9.0
        assert res["pValue"] < 0.01
        assert res["passed"] is False

    def test_shannon_entropy(self):
        # Balanced 50/50 has entropy of 1.0
        analysis = StatisticsService.analyze_sequence("01010101")
        assert analysis["entropy"] == 1.0


class TestValidation:
    """Tests for input validation."""

    def test_valid_request(self):
        v = validate_qrng_request(bits=128, backend="simulator")
        assert v["bits"] == 128
        assert v["backend"] == "simulator"

    def test_zero_bits_rejected(self):
        with pytest.raises(Exception):
            validate_qrng_request(bits=0)

    def test_excessive_bits_rejected(self):
        with pytest.raises(Exception):
            validate_qrng_request(bits=50000)

    def test_invalid_backend_rejected(self):
        with pytest.raises(Exception):
            validate_qrng_request(bits=16, backend="unknown_quantum_device")


class TestAPIEndpoints:
    """Integration tests for FastAPI endpoints."""

    def test_health_endpoint(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"

    def test_generate_endpoint(self):
        payload = {"bits": 64, "backend": "simulator"}
        resp = client.post("/api/qrng/generate", json=payload)
        assert resp.status_code == 200
        data = resp.json()

        assert data["success"] is True
        assert len(data["bits"]) == 64
        assert data["totalBits"] == 64
        assert data["zeros"] + data["ones"] == 64
        assert "monobit" in data["randomnessTest"]
        assert "circuit" in data
        assert "telemetry" in data
        assert data["telemetry"]["shots"] == 64

    def test_generate_endpoint_validation_error(self):
        payload = {"bits": -5}
        resp = client.post("/api/qrng/generate", json=payload)
        assert resp.status_code in [400, 422]

    def test_circuit_endpoint(self):
        resp = client.get("/api/qrng/circuit")
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert "ascii" in data["circuit"]
        assert "qasm" in data["circuit"]

    def test_info_endpoint(self):
        resp = client.get("/api/qrng/info")
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert "superposition" in data["principles"]
        assert "bornRule" in data["principles"]
