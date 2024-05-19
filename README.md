# SDSketchToImage Generator

Preview: 
The User Interface consists of multiple features to draw on the canvas. After clicking generate, the drawn image will be used as input for the image to image model.
The model will then generate a new image that reselbles the drawing.

![Preview](https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Readme/Screenshot.png)

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
