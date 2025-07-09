from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from openai import OpenAI
import os

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the OPENAI_API_KEY environment variable.")
client = OpenAI(api_key=api_key)

app = FastAPI(title="Moderation API", description="API to moderate text and images using OpenAI", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your extension origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define request schemas
class TextRequest(BaseModel):
    text: str


class ImageRequest(BaseModel):
    image_url: HttpUrl


@app.post("/moderate/text")
async def moderate_text(request: TextRequest):
    try:
        response = client.moderations.create(
            model="omni-moderation-latest",
            input=[{"type": "text", "text": request.text}]
        )
        flagged = response.results[0].flagged
        if flagged:
            print("Flagged text detected: ", response)

        print(f"TEXT: {flagged}")
        return flagged
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/moderate/image")
async def moderate_image(request: ImageRequest):
    try:
        response = client.moderations.create(
            model="omni-moderation-latest",
            input=[{"type": "image_url", "image_url": {"url": str(request.image_url)}}]
        )
        flagged = response.results[0].flagged
        if flagged:
            print("Flagged IMAGE detected: ", response)

        print(f"IMAGE: {flagged}")
        return flagged
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("your_file_name:app", host="0.0.0.0", port=8000, reload=True)


    
