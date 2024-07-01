from auth_token import auth_token
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

device = "cpu"  # Set device to CPU

model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, use_auth_token=auth_token)
pipe.to(device)

@app.get("/")
def generate(prompt: str):
    image = pipe(prompt, guidance_scale=8.5).images[0]

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {"image": imgstr}
