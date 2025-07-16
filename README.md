# Computer Use Agents

## Overview

This repository contains a collection of agents designed to interact with computer systems, perform tasks, and assist users in various computing environments.

## Technologies
- FastAPI
- React OR Electron

## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/teozhengyang/cua.git
   cd cua
   ```

2. Run the PowerShell/Bash script to start the backend and frontend:
   ```bash
   ./start.ps1  # For Windows PowerShell
   ./start.sh   # For Linux/MacOS
   ```

## TODO

### Backend

- Implement FastAPI endpoints (/check_models, /execute_command)
- Add websocket support for execute_command endpoint

### Executor
- Ensure executors and tools are callable from backend

### Frontend
- Add websocket support for execute_command endpoint
- Implement results after initial models check

### Models
- Ensure models are callable from backend