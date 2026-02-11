from flask import Flask, request, render_template, jsonify
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("Gemini Key:", os.getenv("GEMINI_API_KEY"))

# Ensure API key is found
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file.")

# Configure Gemini
genai.configure(api_key=api_key)

# Initialize app and model
app = Flask(__name__)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Web interface route
@app.route("/")
def index():
    return render_template("index.html")

# API route
@app.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.get_json()
        user_input = data.get("prompt", "")

        # Generate response
        response = model.generate_content(user_input)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
