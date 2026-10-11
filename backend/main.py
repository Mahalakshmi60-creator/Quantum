"""Main FastAPI application entry point for the Quantum Random Number Generator (QRNG).
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routes.qrng import router as qrng_router

app = FastAPI(
    title="Quantum Random Number Generator (QRNG) API",
    description=(
        "Production-grade API providing true quantum random number generation based on "
        "superposition and measurement using Qiskit 2.5."
    ),
    version="1.0.0"
)

# Configure Cross-Origin Resource Sharing (CORS) for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register QRNG API Routes
app.include_router(qrng_router)


@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend operational readiness."""
    return {
        "status": "healthy",
        "service": "Quantum Random Number Generator API",
        "version": "1.0.0",
        "quantumBackend": "Qiskit StatevectorSampler (Simulated)",
        "docsUrl": "/docs"
    }


@app.get("/", tags=["Root"])
def root():
    """Root endpoint welcoming API consumers and pointing to documentation."""
    return {
        "message": "Welcome to the Quantum Random Number Generator (QRNG) API",
        "documentation": "/docs",
        "healthCheck": "/api/health",
        "generateEndpoint": "/api/qrng/generate"
    }


# Optional: Mount frontend static distribution if built
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
