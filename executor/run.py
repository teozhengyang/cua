import uvicorn
from app.main import create_app
from app.config.settings import Settings


def main():
    settings = Settings()
    
    print(f"Starting FastAPI server on {settings.host}:{settings.port}...")
    print(f"Debug mode: {settings.debug}")
    print(f"Docs available at: http://{settings.host}:{settings.port}/docs")
    
    if settings.debug:
        # Use import string for reload mode
        uvicorn.run(
            "app.main:create_app",
            factory=True,
            host=settings.host,
            port=settings.port,
            log_level=settings.log_level.lower(),
            reload=True
        )
    else:
        # Use app instance for production
        app = create_app()
        uvicorn.run(
            app,
            host=settings.host,
            port=settings.port,
            log_level=settings.log_level.lower(),
            reload=False
        )


if __name__ == "__main__":
    main()