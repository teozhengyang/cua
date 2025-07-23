# Exit on error
$ErrorActionPreference = "Stop"

# Set up colors
$green = "`e[32m"
$yellow = "`e[33m"
$nc = "`e[0m"

# Move to script directory
Set-Location -Path $PSScriptRoot

Write-Host "${yellow}▶️  Starting full-stack application...${nc}"

# -------------------------
# Start FastAPI backend (optional)
# -------------------------
# Write-Host "${yellow}🔧 Setting up backend (FastAPI)...${nc}"
# Set-Location -Path "backend"
# Write-Host "${yellow}📦 Installing Python dependencies (make sure venv is activated)...${nc}"
# pip install -r requirements.txt
# Write-Host "${green}✅ Backend dependencies installed.${nc}"
# Write-Host "${yellow}🚀 Launching FastAPI server on http://localhost:8000 ...${nc}"
# Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"
# Set-Location -Path ".."

# -------------------------
# Start main frontend + Electron
# -------------------------
Write-Host "${yellow}🎨 Setting up frontend (Vite + React)...${nc}"
Set-Location -Path "frontend"

Write-Host "${yellow}📦 Installing frontend dependencies...${nc}"
npm install

Write-Host "${green}✅ Frontend dependencies installed.${nc}"
Write-Host "${yellow}🔨 Building Vite app...${nc}"
npm run build

Write-Host "${green}✅ Build completed.${nc}"
Write-Host "${yellow}🚀 Launching Electron app...${nc}"
$frontend = Start-Process -PassThru -NoNewWindow -FilePath "npm" -ArgumentList "run", "electron"

Set-Location -Path ".."

# -------------------------
# Start applications/test Electron app
# -------------------------
Write-Host "${yellow}🧪 Setting up test application in 'applications'...${nc}"
Set-Location -Path "applications"

Write-Host "${yellow}📦 Installing app dependencies...${nc}"
npm install

Write-Host "${green}✅ App dependencies installed.${nc}"
Write-Host "${yellow}🔨 Building test application...${nc}"
npm run build

Write-Host "${green}✅ Test app build completed.${nc}"
Write-Host "${yellow}🚀 Launching Electron test app...${nc}"
$app = Start-Process -PassThru -NoNewWindow -FilePath "npm" -ArgumentList "run", "electron"

Set-Location -Path ".."

# -------------------------
# Final Info
# -------------------------
Write-Host "${green}✅ All systems running!${nc}"
# Write-Host "${yellow}📡 FastAPI API:     ${nc}http://localhost:8000"
Write-Host "${yellow}🖥️ Main Electron App:     ${nc}(frontend/dist/index.html)"
Write-Host "${yellow}🧪 Test Electron App:     ${nc}(applications/dist/index.html)"
Write-Host "${yellow}📌 Press Ctrl+C or close this terminal to stop everything.${nc}"

# -------------------------
# Wait for manual termination
# -------------------------
Write-Host "${yellow}⏳ Waiting for apps to finish. Close manually when done...${nc}"
Wait-Process -Id $frontend.Id, $app.Id
