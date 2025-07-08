from openai import OpenAI
import os

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the OPENAI_API_KEY environment variable.")
# print("Using OpenAI API key:", api_key)
client = OpenAI(api_key=api_key)

# try:
#     # Test the connection by listing available models
#     response = client.models.list()
#     print("Connection successful! Available models:")
#     for model in response:
#         print(f"- {model.id}")
# except Exception as e:
#     print(f"Failed to connect to OpenAI: {e}")


# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   store=True,
#   messages=[
#     {"role": "user", "content": "write a haiku about ai"}
#   ]
# )

# print(completion.choices[0].message);

# response = client.responses.create(
#     model="gpt-4.1",
#     input="Write a one-sentence bedtime story about a unicorn."
# )

# print(response.output_text)

response = client.moderations.create(
    model="omni-moderation-2024-09-26",
    input="you are a stupid idiiot you should die, go kill yourself your bitch",
)

print(response)

