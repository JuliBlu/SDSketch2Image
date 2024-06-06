# SDSketchToImage Generator

## Overview:

The Sketch-to-Image Generator is a cutting-edge web application that combines the power of React.js for the frontend and Python with Hugging Face models for the backend. This application allows users to create detailed images from a combination of hand-drawn sketches and textual prompts, leveraging advanced machine learning techniques to bring artistic ideas to life.

![Preview](https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Readme/Screenshot.png)

## Key Features:

### User-Friendly Interface:

The frontend, built with React.js, offers an intuitive and interactive platform where users can draw sketches directly within the application.
A clean and responsive design ensures a seamless user experience across various devices.

### Sketch and Prompt Input:

Users can draw their sketches using a digital canvas integrated into the application.
Alongside the sketch, users can input descriptive textual prompts to guide the image generation process.

### AI-Powered Image Generation:

The backend, developed using Python, utilizes Hugging Face models to interpret the sketch and prompt.
Advanced image generation models transform the combined input into a coherent and detailed image.

### Real-Time Processing:

The application processes the sketch and prompt in real-time, providing quick feedback and generated images.
Efficient algorithms and optimized backend ensure minimal latency and high-quality output.

### Customizable Outputs:

Users can fine-tune the generated images by adjusting parameters and re-submitting sketches and prompts.
Multiple iterations allow for refinement until the desired image quality and accuracy are achieved.

### Integration and Sharing:

Generated images can be downloaded or shared directly from the application.
Users can easily integrate the images into various projects, including digital art, design, and multimedia presentations.

## Technical Specifications:

### Frontend:

React.js: Provides a dynamic and responsive user interface.
Canvas Drawing Tool: Integrated for sketch input, offering various brushes and tools for detailed drawing.

### Backend:

Python: Manages server-side logic and integration with machine learning models.
Hugging Face Models: Utilized for interpreting and generating images from the combined sketch and prompt input.
Flask/Django: Frameworks that could be used to handle API requests and manage the communication between frontend and backend.

## Use Cases:

Digital Art Creation: Artists can quickly prototype and generate detailed artwork based on initial sketches and descriptions.
Design and Prototyping: Designers can visualize concepts and ideas efficiently, using sketches and prompts to create mockups and prototypes.
Educational Tools: Educators and students can explore AI-powered image generation, enhancing learning in art and computer science fields.


Examples for logos created by this application:


<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Generated_Images/generated-image(32).png" alt="Preview" width="200"/>
  <img src="https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Generated_Images/generated-image(33).png" alt="Preview" width="200"/>
  <img src="https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Generated_Images/generated-image(35).png" alt="Preview" width="200"/>
</div>

## How To: Start Application (from any machine, e.g. your own laptop)
1. Start the backend
    1. Navigate to the correct subfolder by entering `cd api`
    2. Confirm python and all dependencies are instlaled
    3. Start backend by entering `uvicorn api:app --reload`

2. Start the frontend
    1. Navigate to the correct subfolder by entering `cd client`
    2. Make sure nodejs and all dependencies are installed by typing `npm install`
    3. Start frontend by entering `npm start`
    4. Disconnect from Screen by simultaniously pressing Strg/A/D - the window will restore what you saw before you opened the screen, this is exprected

3. Try opening the application on your local machine by accessing (localhost)
