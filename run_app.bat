@echo off
title Quantum QRNG Launcher
echo ===================================================
echo     Quantum Random Number Generator (QRNG)
echo ===================================================
echo Starting FastAPI Backend on port 8000...
start "QRNG Backend" cmd /k "python -m uvicorn backend.main:app --port 8000 --reload"

echo Starting Vite Frontend on port 5173...
start "QRNG Frontend" cmd /k "npm.cmd --prefix frontend run dev"

echo.
echo Both services are starting!
echo Backend:      http://localhost:8000
echo Frontend:     http://localhost:5173
echo Network Link: http://11.12.19.173:5173 (Access on other devices on same Wi-Fi)
echo API Docs:     http://localhost:8000/docs
echo ===================================================
pause
