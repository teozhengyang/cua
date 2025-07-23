#!/bin/bash

# Exit on any error
set -e

# Set up colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Move to script directory
cd "$(dirname "$0")"

echo -e "${YELLOW}▶️  Starting full-stack application...${NC}"

# -------------------------
# Start FastAPI backend (optional)
# -------------------------
# echo -e "${YELLOW}🔧 Setting up backend (FastAPI)...${NC}"
# cd backend
# echo -e "${YELLOW}📦 Installing Python dependencies (make sure venv is activated)...${NC}"
# pip install -r requirements.txt
# echo -e "${GREEN}✅ Backend dependencies installed.${NC}"
# echo -e "${YELLOW}🚀 Launching FastAPI server on http://localhost:8000 ...${NC}"
# uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
# BACKEND_PID=$!
# cd ..

# -------------------------
# Start main frontend + Electron
# -------------------------
echo -e "${YELLOW}🎨 Setting up frontend (Vite + React)...${NC}"
cd frontend

echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Frontend dependencies installed.${NC}"
echo -e "${YELLOW}🔨 Building Vite app...${NC}"
npm run build

echo -e "${GREEN}✅ Build completed.${NC}"
echo -e "${YELLOW}🚀 Launching Electron app...${NC}"
npm run electron &
FRONTEND_PID=$!
cd ..

# -------------------------
# Start applications/test Electron app
# -------------------------
echo -e "${YELLOW}🧪 Setting up test application in 'applications'...${NC}"
cd applications

echo -e "${YELLOW}📦 Installing app dependencies...${NC}"
npm install

echo -e "${GREEN}✅ App dependencies installed.${NC}"
echo -e "${YELLOW}🔨 Building test application...${NC}"
npm run build

echo -e "${GREEN}✅ Test app build completed.${NC}"
echo -e "${YELLOW}🚀 Launching Electron test app...${NC}"
npm run electron &
APP_PID=$!
cd ..

# -------------------------
# Final Info and Cleanup
# -------------------------
trap "echo -e '\n${YELLOW}🛑 Stopping Electron apps...'; kill $FRONTEND_PID $APP_PID" EXIT

echo -e "${GREEN}✅ All systems running!${NC}"
# echo -e "${YELLOW}📡 FastAPI API:     ${NC}http://localhost:8000"
echo -e "${YELLOW}🖥️ Main Electron App:     ${NC}(frontend/dist/index.html)"
echo -e "${YELLOW}🧪 Test Electron App:     ${NC}(applications/dist/index.html)"
echo -e "${YELLOW}📌 Press Ctrl+C to stop everything.${NC}"

# Wait for all background processes
wait
