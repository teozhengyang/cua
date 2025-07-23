# FastAPI Backend

A modular FastAPI application for text processing using Anthropic's Claude API.

## Project Structure

- `app/` - Main application package
  - `config/` - Configuration management
  - `models/` - Data models and schemas
  - `services/` - Business logic services  
  - `api/` - API routes and dependencies
  - `core/` - Core utilities and exceptions
- `tests/` - Test suite
- `run.py` - Development server runner

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Run the application:
```bash
python run.py
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /items/` - Process text and return extracted blocks
- `POST /items/raw` - Process text and return raw response
- `GET /docs` - API documentation