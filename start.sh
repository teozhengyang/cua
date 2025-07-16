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
# Start FastAPI backend
# -------------------------
# echo -e "${YELLOW}🔧 Setting up backend (FastAPI)...${NC}"
# cd backend

# echo -e "${YELLOW}📦 Installing Python dependencies (make sure venv is activated)...${NC}"
# pip install -r requirements.txt

# echo -e "${GREEN}✅ Backend dependencies installed.${NC}"
# echo -e "${YELLOW}🚀 Launching FastAPI server on http://localhost:8000 ...${NC}"
# uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
# BACKEND_PID=$!

# -------------------------
# Start Vite React frontend with Electron
# -------------------------
echo -e "${YELLOW}🎨 Setting up frontend (Vite + React)...${NC}"
cd frontend

echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install  # or use `yarn` if preferred

echo -e "${GREEN}✅ Frontend dependencies installed.${NC}"
echo -e "${YELLOW}🚀 Launching Vite development server on http://localhost:5173 ...${NC}"
npm run dev &
while ! nc -z localhost 5173; do
  sleep 0.5
done
npm run electron &
FRONTEND_PID=$!

# -------------------------
# Final Info and Cleanup
# -------------------------
trap "echo -e '\n${YELLOW}🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID" EXIT

echo -e "${GREEN}✅ All systems running!${NC}"
# echo -e "${YELLOW}📡 FastAPI API:     ${NC}http://localhost:8000"
echo -e "${YELLOW}🌐 Frontend App:    ${NC}http://localhost:5173"
echo -e "${YELLOW}📌 Press Ctrl+C to stop both servers.${NC}"

# Wait for processes
wait
