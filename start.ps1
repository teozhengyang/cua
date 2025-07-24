# Exit on error
$ErrorActionPreference = "Stop"

# Move to script directory
Set-Location -Path $PSScriptRoot

Write-Host "Starting full-stack application..."

# -------------------------
# Start FastAPI backend
# -------------------------
Write-Host "Setting up backend (FastAPI)..."
Set-Location -Path "backend"
Write-Host "Installing Python dependencies (make sure venv is activated)..."
pip install -r requirements.txt
Write-Host "Backend dependencies installed."
Write-Host "Launching FastAPI server on http://localhost:8000 ..."
$backend = Start-Process -PassThru -NoNewWindow -FilePath "cmd" -ArgumentList "/c", "python", "run.py"
Set-Location -Path ".."

# -------------------------
# Start main frontend + Electron
# -------------------------
Write-Host "Setting up frontend (Vite + React)..."
Set-Location -Path "frontend"

Write-Host "Installing frontend dependencies..."
npm install

Write-Host "Frontend dependencies installed."
Write-Host "Building Vite app..."
npm run build

Write-Host "Build completed."
Write-Host "Launching Electron app..."
try {
    $frontend = Start-Process -PassThru -FilePath "powershell" -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd '$PSScriptRoot\frontend'; npm run electron 2>`$null"
    Write-Host "Frontend Electron app started (PID: $($frontend.Id))"
} catch {
    Write-Host "Warning: Could not start frontend app - $($_.Exception.Message)"
    $frontend = $null
}

Set-Location -Path ".."

# -------------------------
# Start applications/test Electron app
# -------------------------
Write-Host "Setting up test application in 'applications'..."
Set-Location -Path "applications"

Write-Host "Installing app dependencies..."
npm install

Write-Host "App dependencies installed."
Write-Host "Building test application..."
npm run build

Write-Host "Test app build completed."
Write-Host "Launching Electron test app..."
try {
    $app = Start-Process -PassThru -FilePath "powershell" -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd '$PSScriptRoot\applications'; npm run electron 2>`$null"
    Write-Host "Test Electron app started (PID: $($app.Id))"
} catch {
    Write-Host "Warning: Could not start test app - $($_.Exception.Message)"
    $app = $null
}

Set-Location -Path ".."

# -------------------------
# Final Info
# -------------------------
Write-Host "All systems running!"
Write-Host "FastAPI API: http://localhost:8000"
Write-Host "Main Electron App: (frontend/dist/index.html)"
Write-Host "Test Electron App: (applications/dist/index.html)"
Write-Host "Press Ctrl+C or close this terminal to stop everything."

# -------------------------
# Wait for manual termination
# -------------------------
Write-Host "Apps launched. Close the Electron windows manually when done."
Write-Host "Press Ctrl+C to stop this script."

try {
    $validProcesses = @()
    if ($frontend -and $frontend.Id) { $validProcesses += $frontend.Id }
    if ($app -and $app.Id) { $validProcesses += $app.Id }
    
    if ($validProcesses.Count -gt 0) {
        Wait-Process -Id $validProcesses -ErrorAction SilentlyContinue
    } else {
        Write-Host "No processes to wait for. Script ending."
    }
} catch {
    Write-Host "Apps finished or closed manually."
}