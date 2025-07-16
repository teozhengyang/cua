# Exit immediately if a command fails
$ErrorActionPreference = "Stop"

# Colors
$green = "`e[32m"
$yellow = "`e[33m"
$nc = "`e[0m"

# Move to script directory
Set-Location -Path $PSScriptRoot

Write-Host "${yellow}▶️  Starting full-stack application...${nc}"

# -------------------------
# Start FastAPI backend (optional)
# -------------------------
<# 
Write-Host "${yellow}🔧 Setting up backend (FastAPI)...${nc}"
Set-Location -Path "./backend"

Write-Host "${yellow}📦 Installing Python dependencies (make sure venv is activated)...${nc}"
pip install -r requirements.txt

Write-Host "${green}✅ Backend dependencies installed.${nc}"
Write-Host "${yellow}🚀 Launching FastAPI server on http://localhost:8000 ...${nc}"
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"

Set-Location -Path $PSScriptRoot
#>

# -------------------------
# Build Vite React frontend and launch Electron
# -------------------------
Write-Host "${yellow}🎨 Setting up frontend (Vite + React)...${nc}"
Set-Location -Path "./frontend"

Write-Host "${yellow}📦 Installing frontend dependencies...${nc}"
npm install

Write-Host "${green}✅ Frontend dependencies installed.${nc}"
Write-Host "${yellow}🔨 Building Vite app...${nc}"
npm run build

Write-Host "${green}✅ Build completed.${nc}"
Write-Host "${yellow}🚀 Launching Electron app...${nc}"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "electron"

# -------------------------
# Final Info
# -------------------------
Write-Host "${green}✅ All systems running!${nc}"
# Write-Host "${yellow}📡 FastAPI API:     ${nc}http://localhost:8000"
Write-Host "${yellow}🖥️ Electron App:     ${nc}(served from dist/index.html)"
Write-Host "${yellow}📌 Press Ctrl+C or close window to stop everything.${nc}"
