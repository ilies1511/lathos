from openai import OpenAI
import os

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the OPENAI_API_KEY environment variable.")
client = OpenAI(api_key=api_key)


def moderate_text(text: str):
    """
    Moderates a text string using the OpenAI moderation endpoint.
    """
    response = client.moderations.create(
        model="omni-moderation-latest",
        input=[{"type": "text", "text": text}]
    )
    return response


def moderate_image(image_url: str):
    """
    Moderates an image URL using the OpenAI moderation endpoint.
    """
    response = client.moderations.create(
        model="omni-moderation-latest",
        input=[{"type": "image_url", "image_url": {"url": image_url}}]
    )
    return response


if __name__ == "__main__":
    # Example usage
    text_to_moderate = "This is some sample text to classify."
    image_url_to_moderate = "https://www.thesun.co.uk/wp-content/uploads/2025/07/DD-08-07-bull-v2_HERO2.jpg"

    text_response = moderate_text(text_to_moderate)
    print("Text moderation response:")
    print(text_response)

    image_response = moderate_image(image_url_to_moderate)
    print("Image moderation response:")
    print(image_response)
