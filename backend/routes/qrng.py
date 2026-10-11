"""FastAPI routing for QRNG endpoints.
"""
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.controllers.qrng_controller import QRNGController

router = APIRouter(prefix="/api/qrng", tags=["QRNG"])
controller = QRNGController()


class GenerateRequest(BaseModel):
    bits: int = Field(
        default=128,
        ge=1,
        le=4096,
        description="Number of quantum random bits to generate (1 to 4096)."
    )
    backend: Optional[str] = Field(
        default="simulator",
        description="Target backend ('simulator' or 'mock_hardware')."
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "bits": 128,
                "backend": "simulator"
            }
        }
    }


@router.post("/generate")
def generate_random_bits(req: GenerateRequest):
    """Generates random bits via quantum circuit simulation."""
    return controller.generate(bits=req.bits, backend=req.backend)


@router.get("/circuit")
def get_circuit_details():
    """Returns quantum circuit architecture, ASCII drawing, and QASM."""
    return controller.get_circuit()


@router.get("/info")
def get_quantum_info():
    """Returns educational explanations, PRNG vs QRNG comparison, and Viva prep notes."""
    return controller.get_info()
