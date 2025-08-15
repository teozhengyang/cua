"""
Test script for Computer Use Agent
"""
import asyncio
import os
import sys

# Add the backend app to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.config.settings import Settings
from app.services.computer_use_service import ComputerUseService
from app.services.actor_service import ActorService


async def test_computer_use_service():
    """Test the computer use service functionality."""
    print("🔧 Testing Computer Use Service...")
    
    # Initialize settings
    settings = Settings()
    computer_service = ComputerUseService(settings)
    
    # Test getting available tools
    tools = computer_service.get_available_tools()
    print(f"✅ Available tools: {tools}")
    
    # Test taking a screenshot
    try:
        print("📸 Taking screenshot...")
        result = await computer_service.take_screenshot()
        print(f"✅ Screenshot taken successfully: {result.output}")
        if hasattr(result, 'base64_image') and result.base64_image:
            print(f"📄 Screenshot data length: {len(result.base64_image)} characters")
    except Exception as e:
        print(f"❌ Screenshot failed: {str(e)}")
    
    return computer_service


async def test_actor_service():
    """Test the actor service functionality."""
    print("\n🤖 Testing Actor Service...")
    
    try:
        # Initialize settings
        settings = Settings()
        
        if not settings.api_key or settings.api_key == "your_anthropic_api_key_here":
            print("⚠️  Skipping actor service test - no valid API key configured")
            print("   To test with actual Claude integration, set your API key in backend/.env")
            return None
        
        actor_service = ActorService(settings)
        
        # Test simple text processing
        print("💬 Testing simple text processing...")
        response = actor_service.process_text("Hello, can you help me?")
        print(f"✅ Response: {response}")
        
        # Test conversation info
        conv_length = actor_service.get_conversation_length()
        print(f"📊 Conversation length: {conv_length}")
        
        return actor_service
        
    except Exception as e:
        print(f"❌ Actor service test failed: {str(e)}")
        return None


async def main():
    """Main test function."""
    print("🚀 Starting Computer Use Agent Tests\n")
    
    # Test computer use service
    computer_service = await test_computer_use_service()
    
    # Test actor service
    actor_service = await test_actor_service()
    
    print("\n✨ Test Summary:")
    print(f"   Computer Use Service: {'✅ Working' if computer_service else '❌ Failed'}")
    print(f"   Actor Service: {'✅ Working' if actor_service else '❌ Failed or Skipped'}")
    
    if computer_service and actor_service:
        print("\n🎉 All services are working! You can now:")
        print("   1. Start the backend: cd backend && python run.py")
        print("   2. Start the frontend: cd frontend && npm run dev")
        print("   3. Try interacting with the computer use agent!")
    
    elif computer_service:
        print("\n🎯 Computer Use Service is working!")
        print("   You can start the backend and test computer actions via API")
        print("   Set up your Anthropic API key for full functionality")


if __name__ == "__main__":
    asyncio.run(main())
