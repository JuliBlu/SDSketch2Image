from auth_token import auth_token
from fastapi import FastAPI, UploadFile, File, Response, Request
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from diffusers import StableDiffusionImg2ImgPipeline
import base64
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
import requests
from fastapi.exceptions import RequestValidationError
import logging
import multipart

app = FastAPI()

logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

device = "cuda"

# SD Normal
model_id_or_path = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id_or_path, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token)

pipe = pipe.to(device)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    # Log the details of the invalid request
    logger.warning("Invalid request received.")
    logger.info(f"Request URL: {request.url}")
    logger.info(f"Request Method: {request.method}")
    logger.info(f"Request Headers: {request.headers}")
    logger.info(f"Request Body: {await request.body()}")
    return Response(content="Invalid request", status_code=400)

@app.post("/")
async def generate(request: Request):
    form = await request.form()
    prompt = form.get('prompt')

    image_data = await form['image'].read()
    image = Image.open(BytesIO(image_data)).convert("RGB")
    image = image.resize((400, 400))

    with autocast(device):
        images = pipe(prompt=prompt, image=image, strength=0.75, guidance_scale=7.5).images

    generated_image = images[0]
    # Convert the generated image to base64
    buffer = BytesIO()
    generated_image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")

# New endpoint for the InstructPix2Pix model
@app.post("/instruct-pix2pix")
async def generate_instruct_pix2pix(request: Request):
    form = await request.form()
    prompt = form.get('prompt')

    image_data = await form['image'].read()
    image = Image.open(BytesIO(image_data)).convert("RGB")
    image = image.resize((400, 400))

    with autocast(device):
        model_id = "timbrooks/instruct-pix2pix"
        instruct_pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(model_id, torch_dtype=torch.float16, safety_checker=None)
        instruct_pipe.to(device)
        instruct_pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(instruct_pipe.scheduler.config)
        images = instruct_pipe(prompt, image=image, num_inference_steps=10, image_guidance_scale=1).images

    generated_image = images[0]
    # Convert the generated image to base64
    buffer = BytesIO()
    generated_image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    return Response(content=imgstr, media_type="image/png")
