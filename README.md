# SDSketchToImage Generator

Preview: 
![Preview](https://github.com/BluJy/SDSketch2Image/blob/main/Examples/Readme/Screenshot.png)


## If the application is running on the server...
... you can access it here: (http://10.36.88.133:3000/) 
(on the target machine, i.e. the PC that will run the demo)

## How To: Start Application on Server (from any machine, e.g. your own laptop) in case the address above is not reachable
1. Connect to server
    1. Open a console (on Windows: Search for "cmd")
    2. Connect to server via ssh by entering `ssh iao-hci@10.36.88.133`
    3. Enter password (Ask Julian Blumenröther, Eileen Wemmer, Jeremias Lange, or Bhupender Saini)
    4. Navigate to the correct subfolder by entering `cd ./Documents/Projects/KI-Studios_Bildgenerator2/StableDiffusionSketchToImage/`

2. Check for running screens, kill them if neccessary
    1. Enter `screen -ls` - You will get a list of all screens. 
    2. If the list includes \<number\>.marketingAPI:
        Enter `screen -XS marketingAPI quit`
    3. If the list includes \<number\>.marketingClient:
        Enter `screen -XS marketingClient quit`

3. Start the backend
    1. Start a new Screen by entering `screen -S marketingAPI` - the window will clear, this is expected
    2. Navigate to the correct subfolder by entering `cd api`
    3. Enter correct conda environment by entering `conda activate BildGenEnv`
    4. Start backend by entering `uvicorn api:app --host 10.36.88.133 --port 8000`
    5. Disconnect from Screen by simultaniously pressing Strg/A/D - the window will restore what you saw before you opened the screen, this is exprected

4. Start the frontend
    1. Start a new Screen by entering `screen -S marketingClient` - the window will clear, this is expected
    2. Navigate to the correct subfolder by entering `cd client`
    3. Enter correct conda environment by entering `conda activate BildGenEnv`
    4. Start frontend by entering `npm start`
    5. Disconnect from Screen by simultaniously pressing Strg/A/D - the window will restore what you saw before you opened the screen, this is exprected

5. Try opening the application on your local machine by accessing (http://10.36.88.133:3000/)

### Troubleshooting:
1. Connection times out when trying to connect via ssh:
    Solution: Connect to a network **outside** IAO (e.g. eduroam). This whole procedure can be done from any pc - also your own laptop. Use a VPN to connect to the IAO network. Try again.
