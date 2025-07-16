# Exit on error
$ErrorActionPreference = "Stop"

# Define colors
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$NC = "`e[0m"

# Move to script directory
Set-Location -Path $PSScriptRoot

Write-Host "${YELLOW}▶️  Starting full-stack application...${NC}"

# -------------------------
# Start FastAPI backend (optional)
# -------------------------
# Write-Host "${YELLOW}🔧 Setting up backend (FastAPI)...${NC}"
# Set-Location -Path "$PSScriptRoot/backend"

# Write-Host "${YELLOW}📦 Installing Python dependencies (make sure venv is activated)...${NC}"
# pip install -r requirements.txt

# Write-Host "${GREEN}✅ Backend dependencies installed.${NC}"
# Write-Host "${YELLOW}🚀 Launching FastAPI server on http://localhost:8000 ...${NC}"
# Start-Process -NoNewWindow -PassThru -FilePath "uvicorn" -ArgumentList "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000" | Out-Null
# $backendPid = Get-Process -Name "uvicorn" | Select-Object -First 1 -ExpandProperty Id

# -------------------------
# Start Vite React frontend with Electron
# -------------------------
Write-Host "${YELLOW}🎨 Setting up frontend (Vite + React)...${NC}"
Set-Location -Path "$PSScriptRoot/frontend"

Write-Host "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

Write-Host "${GREEN}✅ Frontend dependencies installed.${NC}"
Write-Host "${YELLOW}🚀 Launching Vite development server on http://localhost:5173 ...${NC}"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Write-Host "${YELLOW}⏳ Waiting for Vite server to start...${NC}"

# Wait for Vite port 5173 to open
while (-not (Test-NetConnection -ComputerName "localhost" -Port 5173 -InformationLevel Quiet)) {
    Start-Sleep -Milliseconds 500
}

Write-Host "${GREEN}✅ Vite server is up! Launching Electron...${NC}"
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "electron"
$electronPid = Get-Process -Name "electron" | Select-Object -First 1 -ExpandProperty Id

# -------------------------
# Final Info
# -------------------------
Write-Host "${GREEN}✅ All systems running!${NC}"
# Write-Host "${YELLOW}📡 FastAPI API:     ${NC}http://localhost:8000"
Write-Host "${YELLOW}🌐 Frontend App:    ${NC}http://localhost:5173"
Write-Host "${YELLOW}📌 Use Task Manager or Stop Electron manually to end.${NC}"
