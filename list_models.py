import google.generativeai as genai

# Replace this with your Gemini API key
genai.configure(api_key="add_your_gemini_api_key_here)

# List all available models
models = genai.list_models()
for model in models:
    print(model.name)
