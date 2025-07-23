import uvicorn
from app.main import create_app
from app.config.settings import Settings


def main():
    settings = Settings()
    app = create_app()
    
    print(f"Starting FastAPI server on {settings.host}:{settings.port}...")
    print(f"Debug mode: {settings.debug}")
    print(f"Docs available at: http://{settings.host}:{settings.port}/docs")
    
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.lower(),
        reload=settings.debug
    )


if __name__ == "__main__":
    main()