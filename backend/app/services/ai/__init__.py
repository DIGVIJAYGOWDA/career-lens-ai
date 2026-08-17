from app.services.ai.gemini import GeminiAIProvider

ai_provider = GeminiAIProvider()

def get_ai_provider():
    return ai_provider
