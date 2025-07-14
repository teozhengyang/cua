# Enable strict mode and exit on error
$ErrorActionPreference = "Stop"

# Set colored output helpers
function Write-Yellow { Write-Host $args -ForegroundColor Yellow }
function Write-Green { Write-Host $args -ForegroundColor Green }

# Get absolute root directory
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Yellow "▶️  Starting full-stack application..."

# -------------------------
# Start FastAPI backend
# -------------------------
# Write-Yellow "🔧 Setting up backend (FastAPI)..."
# Set-Location $BackendDir

# Write-Yellow "📦 Installing Python dependencies..."
# pip install -r requirements.txt

# Write-Green "✅ Backend dependencies installed."
# Write-Yellow "🚀 Launching FastAPI server on http://localhost:8000 ..."
# Start-Process powershell -ArgumentList "uvicorn main:app --reload --host 0.0.0.0 --port 8000" -NoNewWindow

# -------------------------
# Start Vite React frontend
# -------------------------
Write-Yellow "🎨 Setting up frontend (Vite + React)..."
Set-Location $FrontendDir

Write-Yellow "📦 Installing frontend dependencies..."
npm install

Write-Green "✅ Frontend dependencies installed."
Write-Yellow "🚀 Launching Vite dev server on http://localhost:5173 ..."
Start-Process powershell -ArgumentList "npm run dev" -NoNewWindow

# -------------------------
# Info
# -------------------------
Write-Green "✅ All systems running!"
# Write-Yellow "📡 FastAPI API:     http://localhost:8000"
Write-Yellow "🌐 Frontend App:    http://localhost:5173"
Write-Yellow "📌 Use Task Manager or Ctrl+C in individual shells to stop servers."
