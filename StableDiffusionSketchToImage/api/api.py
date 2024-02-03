from auth_token import auth_token
from fastapi import FastAPI, UploadFile, File, Response, Request
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline, DiffusionPipeline
from diffusers import StableDiffusionImg2ImgPipeline, StableDiffusionXLImg2ImgPipeline
from diffusers import StableDiffusionXLAdapterPipeline, T2IAdapter, EulerAncestralDiscreteScheduler, AutoencoderKL
from diffusers.utils import load_image, make_image_grid
from controlnet_aux.pidi import PidiNetDetector
import base64
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler
import requests
from fastapi.exceptions import RequestValidationError
import logging
import multipart
import os

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

##################################################################
##########################Everything TencentARC###################
##################################################################

adapter = T2IAdapter.from_pretrained(
  "TencentARC/t2i-adapter-sketch-sdxl-1.0", torch_dtype=torch.float16, varient="fp16"
).to("cuda")

# load euler_a scheduler
model_id = 'stabilityai/stable-diffusion-xl-base-1.0'
euler_a = EulerAncestralDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
vae=AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
tencentpipe = StableDiffusionXLAdapterPipeline.from_pretrained(
    model_id, vae=vae, adapter=adapter, scheduler=euler_a, torch_dtype=torch.float16, variant="fp16",
).to("cuda")
tencentpipe.enable_xformers_memory_efficient_attention()

pidinet = PidiNetDetector.from_pretrained("lllyasviel/Annotators").to("cuda")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


##################################################################
##########################Everything RunwayML###################
##################################################################


# SD Normal
model_id_or_path = "runwayml/stable-diffusion-v1-5"
runwaymlpipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id_or_path, revision="fp16", torch_dtype=torch.float16, use_auth_token=auth_token)

runwaymlpipe = runwaymlpipe.to(device)

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
    guidance_scale = float(form.get('guidanceScale'))
    adapter_conditioning_scale = float(form.get('adapterConditioningScale'))
    adapter_conditioning_factor = float(form.get('adapterConditioningFactor'))
    model_name = form.get('modelName')
    image_data = await form['image'].read()
    image = Image.open(BytesIO(image_data)).convert("RGB")
    init_image = image.resize((400, 400))
    #url = "https://huggingface.co/Adapter/t2iadapter/resolve/main/figs_SDXLV1.0/org_sketch.png"
    #image = load_image(url)

    negative_prompt = "nude, nsfw, extra digit, fewer digits, cropped, worst quality, low quality, glitch, deformed, mutated, ugly, disfigured"

    print(model_name)

    if (model_name=="TencentARC"):
        image = pidinet(
          init_image, detect_resolution=1024, image_resolution=1024, apply_filter=True
        )
        gen_images = tencentpipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=image,
            num_inference_steps=30,
            adapter_conditioning_scale = adapter_conditioning_scale,
            guidance_scale = guidance_scale,
            adapter_conditioning_factor = adapter_conditioning_factor
        )
        generated_image = gen_images[0][0]
        #generated_image.save('out_sketch.png')
        #Convert the generated image to base64
        buffer = BytesIO()
        generated_image.save(buffer, format="PNG")
        imgstr = base64.b64encode(buffer.getvalue())
        return Response(content=imgstr, media_type="image/png")

    elif (model_name=="RunwayML"):

            with autocast(device):
                images = runwaymlpipe(prompt=prompt, image=image, strength=0.75, guidance_scale=7.5).images

            generated_image = images[0]
            # Convert the generated image to base64
            buffer = BytesIO()
            generated_image.save(buffer, format="PNG")
            imgstr = base64.b64encode(buffer.getvalue())

            return Response(content=imgstr, media_type="image/png")

    else:
        return

def save_images (images):
    base_dir = "/images"
    os.makedirs(base_dir, exist_ok=True)
    image_filename = "1.png"

    #image_filename = "2.png"
    #image_filename = "3.png"
    #image_filename = "4.png"
    save_path1 = os.path.join(base_dir, image_filename)
    #save_path2 = os.path.join(base_dir, image_filename)
    #save_path3 = os.path.join(base_dir, image_filename)
    #save_path4 = os.path.join(base_dir, image_filename)


    images[0].save(save_path1, format="PNG")
    #images[1].save(save_path2, format="PNG")
    #images[2].save(save_path3, format="PNG")
    #images[3].save(save_path4, format="PNG")
