"""Input validation utilities for QRNG API requests.
"""
from typing import Optional, Dict, Any
from fastapi import HTTPException

MIN_BITS = 1
MAX_BITS = 4096
ALLOWED_BACKENDS = {"simulator", "mock_hardware"}


def validate_qrng_request(bits: Any, backend: Optional[str] = "simulator") -> Dict[str, Any]:
    """Validates the input parameters for QRNG generation.

    Args:
        bits: Number of random bits requested.
        backend: Optional backend identifier.

    Returns:
        Validated dictionary with typed values.

    Raises:
        HTTPException: If input validation fails with HTTP 400 Bad Request.
    """
    # 1. Type validation
    if bits is None:
        raise HTTPException(
            status_code=400,
            detail={"error": "MissingInput", "message": "The 'bits' parameter is required."}
        )

    try:
        bits_int = int(bits)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail={
                "error": "InvalidType",
                "message": f"Expected an integer for 'bits', received {type(bits).__name__}."
            }
        )

    # 2. Range validation
    if bits_int < MIN_BITS:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "BitCountTooLow",
                "message": f"Bit count must be at least {MIN_BITS}. Provided: {bits_int}"
            }
        )

    if bits_int > MAX_BITS:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "BitCountTooHigh",
                "message": f"Bit count cannot exceed {MAX_BITS} to protect simulation resources. Provided: {bits_int}"
            }
        )

    # 3. Backend validation
    backend_choice = (backend or "simulator").lower().strip()
    if backend_choice not in ALLOWED_BACKENDS:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "InvalidBackend",
                "message": f"Backend '{backend}' is not supported. Choose from: {sorted(list(ALLOWED_BACKENDS))}"
            }
        )

    return {
        "bits": bits_int,
        "backend": backend_choice
    }
