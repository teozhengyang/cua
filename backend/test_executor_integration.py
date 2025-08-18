#!/usr/bin/env python3
"""
Test script to verify that the ActorService can communicate with the ExecutorClient.
"""
import asyncio
import logging
import sys
import os

# Add the backend app to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config.settings import Settings
from app.services.actor_service import ActorService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_executor_connection():
    """Test if the executor service is accessible from ActorService."""
    try:
        settings = Settings()
        actor_service = ActorService(settings)
        
        # Test executor health check
        logger.info("Testing executor health check...")
        is_healthy = await actor_service.check_executor_health()
        logger.info(f"Executor health: {'✅ Healthy' if is_healthy else '❌ Unhealthy'}")
        
        if is_healthy:
            # Test getting available tools
            logger.info("Getting available tools...")
            tools = await actor_service.get_available_tools()
            logger.info(f"Available tools: {tools}")
            
            logger.info("✅ ExecutorClient integration test passed!")
        else:
            logger.error("❌ Executor service is not healthy. Make sure the executor is running.")
            
    except Exception as e:
        logger.error(f"❌ Test failed: {str(e)}")


if __name__ == "__main__":
    asyncio.run(test_executor_connection())
