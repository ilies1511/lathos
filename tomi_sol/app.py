from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
import os
from dotenv import load_dotenv

# Initialize app
app = Flask(__name__)

# Load .env and set up OpenAI client
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/check', methods=['POST'])
def check_url_content():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        text = soup.get_text(separator=" ", strip=True)[:3000]

        moderation_resp = client.moderations.create(input=text)
        result = moderation_resp.results[0]

        return jsonify({
            "flagged": result.flagged,
            "categories": dict(result.categories),
            "category_scores": dict(result.category_scores)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ensure app.run() is outside the function
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)