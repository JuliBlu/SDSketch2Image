import {
    ChakraProvider,
    Heading,
    Container,
    Input,
    Button,
    Wrap,
    Stack,
    Image as ChakraImage,
    Box,
    Link,
    Collapse,
    VStack,
    Flex,
    Text,
    Link as ChakraLink,
    Spacer, IconButton,  HStack,
    Slider, SliderTrack, SliderFilledTrack, SliderThumb,
    SkeletonCircle,
    CircularProgress,
    Tooltip,
    SkeletonText, background, FormControl, FormLabel
} from "@chakra-ui/react";
import axios from "axios";
import {useState, useRef, useEffect} from "react";
import {ChromePicker} from 'react-color';
import {FaFill, FaHome, FaLink, FaPencilAlt, FaTruckLoading, FaBars, FaDesktop, FaServer} from 'react-icons/fa';
import {FaDatabase, FaChartPie, FaLightbulb, FaChartLine, FaCogs, FaRocket, FaCode} from 'react-icons/fa';
import {FaUndo, FaRedo} from 'react-icons/fa';
import {FaSave, FaTrash} from 'react-icons/fa';
import './styles/ProgressBar.css';
import './styles/ParameterSlider.css';


const App = ({onHome}) => {
    const [image, updateImage] = useState();
    const [generationHistory, updateGenerationHistory] = useState([]);
    const [generationIndex, setGenerationIndex] = useState(0);
    const [prompt, updatePrompt] = useState(""); //
    const [guidanceScale, updateGuidanceScale] = useState(7.5); // 0.1-30
    const [adapterConditioningScale, updateAdapterConditioningScale] = useState(0.6); // 0.5to1
    const [adapterConditioningFactor, updateAdapterConditioningFactor] = useState(0.6); // 0.5to1
    const [loading, updateLoading] = useState();
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [color, setColor] = useState('#ffffff');
    const [drawColor, setDrawColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isFillTool, setIsFillTool] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [linkType, setLinkType] = useState(true);
    const [modelName, setModelName] = useState("TencentARC");
    const [modelNumber, setModelNumber] = useState(0);
    const [penSize, setPenSize] = useState(5); // Default pen size is 5
    const [error, setError] = useState(false);
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [squareColors, setSquareColors] = useState(["#FA283B", "#7B4A4F", "#492C3C"]);
    const [activeStyleButton, setActiveStyleButton] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //const [lastGeneratedImage, setLastGeneratedImage] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showDrawingHistory, setShowDrawingHistory] = useState(false);
    const [modelState, setModelState] = useState(0);
    const modelOptions = [
        { name: 'TencentARC', icon: <FaRocket /> },
        { name: 'RunwayML', icon: <FaChartPie /> }
    ];

    const getModelIcon = () => {
        return modelOptions[modelState].icon;
    };

    const getModelName = () => {
        return modelOptions[modelState].name;
    };

    const getNextModelName = () => {
        return modelOptions[(modelState + 1) % modelOptions.length].name;
    };




    const handleModelChange = () => {
        // Calculate the next state (cyclically)
        const nextModelState = (modelState + 1) % modelOptions.length;
        setModelState(nextModelState);
        setModelName(getNextModelName());
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleStyleButtonClick = (buttonLabel) => {
        if (activeStyleButton === buttonLabel) {
            setActiveStyleButton(''); // Deactivate all buttons
        } else {
            setActiveStyleButton(buttonLabel);
        }
    };

    const saveColor = (index) => {
        const newSquareColors = [...squareColors];
        newSquareColors[index] = drawColor; // Assuming drawColor holds the selected color
        setSquareColors(newSquareColors);
    };

    const deleteSquare = (index) => {
        const newSquareColors = [...squareColors];
        newSquareColors.splice(index, 1);
        setSquareColors(newSquareColors);
    };

    const addSquare = () => {
        if (squareColors.length < 8) { // Limit the number of squares to 8 for example
            const newSquareColors = [...squareColors, "#000000"];
            setSquareColors(newSquareColors);
        }
    };

    const handlePenSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setPenSize(newSize);
    };

    const updateProgress = (progressValue) => {
        setProgress(progressValue);
    };

    const updateError = (hasError) => {
        setError(hasError);
    };



    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 400; // Set the desired width of the canvas
        canvas.height = 400; // Set the desired height of the canvas
        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
        clearCanvas();
    }, []);

    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };


    const saveCanvasToDrawingHistory = () => {
        const newHistory = drawingHistory.slice(0, historyIndex + 1);
        const canvas = canvasRef.current;
        newHistory.push(canvas.toDataURL());
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length-1);
        //console.log("SaveCanvas - Drawinghistory Length:" + drawingHistory.length + "| newHistory: "+newHistory.length)
    };

    const saveImageToDrawingHistory = (image) => {
        const newHistory = drawingHistory.slice(0, historyIndex + 1);
        newHistory.push(`data:image/png;base64,${image}`);
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length-1);
    };

    const saveImageToGenerationHistory = (Image) => {
        const newHistory = generationHistory.slice(0, generationIndex + 1);
        newHistory.push(Image)
        updateGenerationHistory(newHistory);
        setGenerationIndex(newHistory.length-1);
    };


    const startDrawing = ({nativeEvent}) => {

        contextRef.current.lineWidth = penSize;
        if (!isDrawingRef.current && !isFillTool) {
            isDrawingRef.current = true;
            const {offsetX, offsetY} = nativeEvent;
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        } else if (!isDrawingRef.current && isFillTool) {
            const {offsetX, offsetY} = nativeEvent;
            fillEnclosedArea(offsetX, offsetY);
        }

    };


    const continueDrawing = ({nativeEvent}) => {
        contextRef.current.lineWidth = penSize;
        if (isDrawingRef.current) {
            contextRef.current.strokeStyle = drawColor;
            const {offsetX, offsetY} = nativeEvent;
            if (!isFillTool) {
                contextRef.current.lineTo(offsetX, offsetY);
                contextRef.current.stroke();
            }
        }
    };

    const handleHistoryClick = (index) => {
        const clickedImageUrl = drawingHistory[index];
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        setHistoryIndex(index);
        img.src = clickedImageUrl;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };

    const handleGenerationHistoryClick = (index) => {
        setGenerationIndex(index);
        updateImage(generationHistory[index]);
    };


    const handleShowDrawingHistory = () => {
        setShowDrawingHistory(!showDrawingHistory)
    };


    const endDrawing = () => {
        if (isDrawingRef.current) {
            const context = contextRef.current;
            context.strokeStyle = drawColor;
            isDrawingRef.current = false;
            saveCanvasToDrawingHistory();
        }



    };

    const endDrawingWithoutSave = () => {
        if (isDrawingRef.current) {
            const context = contextRef.current;
            context.strokeStyle = drawColor;
            isDrawingRef.current = false;
        }

    };

    const fillEnclosedArea = (startX, startY) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const {data, width, height} = imageData;

        const pixelStack = [];
        const startPos = (startY * width + startX) * 4;
        const startColor = [data[startPos], data[startPos + 1], data[startPos + 2], data[startPos + 3]];

        const MAX_PIXELS = 1000; // Maximum number of pixels to process

        const matchColor = (pos) => {
            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];
            const a = data[pos + 3];
            return r === startColor[0] && g === startColor[1] && b === startColor[2] && a === startColor[3];
        };

        const setColor = (pos) => {
            data[pos] = hexToRgb(drawColor).r;
            data[pos + 1] = hexToRgb(drawColor).g;
            data[pos + 2] = hexToRgb(drawColor).b;
            data[pos + 3] = 255; // Fully opaque
        };

        const checkAndPush = (x, y) => {
            const pos = (y * width + x) * 4;
            if (matchColor(pos)) {
                pixelStack.push([x, y]);
            }
        };

        const processPixels = () => {
            const startTime = performance.now();
            let processedPixels = 0;

            while (pixelStack.length) {
                const [x, y] = pixelStack.pop();
                const pos = (y * width + x) * 4;

                if (matchColor(pos)) {
                    setColor(pos);

                    if (x > 0) {
                        checkAndPush(x - 1, y);
                    }
                    if (x < width - 1) {
                        checkAndPush(x + 1, y);
                    }
                    if (y > 0) {
                        checkAndPush(x, y - 1);
                    }
                    if (y < height - 1) {
                        checkAndPush(x, y + 1);
                    }
                }

                processedPixels++;

                const currentTime = performance.now();
                const elapsedTime = currentTime - startTime;

                if (processedPixels >= MAX_PIXELS || elapsedTime >= 16) {
                    requestAnimationFrame(processPixels);
                    return;
                }
            }

            context.putImageData(imageData, 0, 0);
        };

        checkAndPush(startX, startY);
        requestAnimationFrame(processPixels);
    };



    const undo = () => {

        if (historyIndex > 0) {
            setHistoryIndex(prevHistoryIndex => prevHistoryIndex - 1); // Use functional update here
            const newHistoryIndex = historyIndex - 1; // Calculate the new history index based on the updated state
            const image = new Image();
            image.src = drawingHistory[newHistoryIndex];
            image.onload = () => {
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            };
        }
    };

    const drawFromHistory = (historyIndex) => {


    };

    const redo = () => {
        if (historyIndex < drawingHistory.length) {
            setHistoryIndex(prevHistoryIndex => prevHistoryIndex + 1); // Use functional update here
            const newHistoryIndex = historyIndex + 1; // Calculate the new history index based on the updated state

            const image = new Image();
            image.onload = () => {
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            };
            image.src = drawingHistory[newHistoryIndex];
        }
    };

    const handleImageUpload = (file) => {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        drawUploadedImage(imageUrl);
    };

    const drawUploadedImage = (imageUrl) => {
        if (imageUrl) {

            const image = new Image();
            image.onload = () => {
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            };
            image.src = imageUrl;
        }
    };

    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return {r, g, b};
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const formData = new FormData();
        formData.append('prompt', prompt+", "+activeStyleButton+" Style");
        formData.append('image', blob, 'canvas-image.png'); // 'canvas-image.png' is the file name
        formData.append("guidanceScale", guidanceScale)
        formData.append("adapterConditioningScale", adapterConditioningScale)
        formData.append("adapterConditioningFactor", adapterConditioningFactor)
        formData.append("modelName", modelName)

        var link = "http://127.0.0.1:8000"
        if(linkType == true){
            link = 'http://127.0.0.1:8000'
        } else if (linkType == false){
            link = 'http://127.0.0.1:8000'
        } else{
            console.log("Wrong link type")
        }

        generate(formData, link, updateProgress, updateError);
    };


    const generate = async (formData, link, updateProgress, updateError) => {
        updateLoading(true);
        updateError(false);
        let hasError = false;
        try {
            // ... other progress update setTimeouts

            const result = await axios.post(link, formData, {
                onUploadProgress: (progressEvent) => {
                    if (!hasError) {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        updateProgress(progress);
                    }
                },
            });

            saveImageToGenerationHistory(result.data);
            updateImage(result.data);
            updateLoading(false);
        } catch (error) {
            console.error("Error during generation:", error);
            hasError = true;
            updateProgress(100);
            updateLoading(false);
            updateError(true);
        }
    };

    const saveCanvasImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "canvas-image.png";
        link.click();
    };

    const saveAIImage = () => {
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${image}`;
        link.download = "generated-image.png";
        link.click();
    };

    const drawGeneratedImage = () => {
        console.log("Image: "+image)
        if (image) {
            console.log("Draw Image to Canvas")
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            const newimage = new Image();
            newimage.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(newimage, 0, 0, canvas.width, canvas.height);
            };
            newimage.src = `data:image/png;base64,${image}`;
            saveImageToDrawingHistory(image);
        }

    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "#FFFFFF"; // Set the fill color to white (#FFFFFF)
        context.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with the white color

        // Reset the drawing history

        const baseCanvasDataUrl = canvas.toDataURL();
        setDrawingHistory([]);
        setHistoryIndex(0);
        saveCanvasToDrawingHistory();
    };

    return (
        <ChakraProvider>

            <Flex
                p={4}
                bg="white" /* Change background color to white */
                borderBottom="1px solid #ccc" /* Add a clear separator (border) */
                alignItems="center"
                position="sticky"
                top="0" /* Stick the bar to the top of the page */
                zIndex="999" /* Ensure it appears above other content */
            >
                {/* Home Button on the Left */}
                <Button
                    colorScheme="teal"
                    leftIcon={<FaHome />}
                    onClick={onHome}
                >
                    SDSketch
                </Button>
                <Text ml={10} fontWeight="bold" fontSize={"18pt"}>
                    Stable Diffusion Sketch & Text to Image Generator
                </Text>

                <Spacer />

                <Tooltip label={"Show History"}>
                    <Button
                        onClick={handleShowDrawingHistory}

                        mr={5}
                        colorScheme='teal'
                    >
                        History
                    </Button>
                </Tooltip>

                <Tooltip label={"Change used model"} placement="top">
                    <Button
                        colorScheme={"teal"}
                        onClick={() => handleModelChange()}
                        mr={5}
                        disabled={false}
                        leftIcon={getModelIcon()}
                    >
                        {getModelName()}
                    </Button>
                </Tooltip>



                <Tooltip label={linkType ? 'Host for Model: Switch to localhost' : 'Host for Model: Switch to ml pc'} placement="top">
                    <Button
                        colorScheme={linkType ? 'teal' : 'blue'}
                        onClick={() => setLinkType(!linkType)}
                        mr={5}
                        leftIcon={linkType ? <FaServer /> : <FaDesktop />}
                    >
                        {linkType ? 'Remote' : 'Local'}
                    </Button>
                </Tooltip>

                <ChakraLink
                    href="https://frau-hofer.iao.fraunhofer.de?tripetto=3f5be3f6d211b4f4887e215c8f340e085babdd2da72095c13cc7f297bda79f42" // Replace with the desired link
                    target="_blank" // Open link in a new tab
                    rel="noopener noreferrer"
                >
                    <Button colorScheme="teal" mr={5}>
                        Go to Survey
                    </Button>
                </ChakraLink>

                {/* Hamburger Menu Button on the Right */}
                <IconButton
                    icon={<FaBars />}
                    aria-label = "Open Menu"
                    colorScheme = "teal"
                    onClick={toggleMenu}
                />

                {/* Menu Dropdown */}
                <Collapse in={isMenuOpen}>
                    <Box
                        bg="white"
                        p={4}
                        position="absolute"
                        top="56px" /* Adjust this value to align with the top bar */
                        right="0"
                        shadow="md"
                        borderBottom="1px solid #ccc" /* Add a clear separator (border) */
                    >
                        <VStack align="stretch" spacing={2}>
                            {/* List of Links */}
                            <Text
                                as="button"
                                onClick={() => {
                                    // Handle the link click here
                                    closeMenu();
                                }}
                            >
                                <Link
                                    href={"https://huggingface.co/TencentARC/t2i-adapter-sketch-sdxl-1.0"}
                                    color="blue.500"
                                    target="_blank" // Add this attribute to open in a new tab
                                    rel="noopener noreferrer" // Include this for security
                                >
                                   Model Website
                                </Link>
                            </Text>
                            <Text
                                as="button"
                                onClick={() => {
                                    // Handle the link click here
                                    closeMenu();
                                }}
                            >
                                <Link
                                    href={"https://huggingface.co/spaces/TencentARC/T2I-Adapter-SDXL-Sketch"}
                                    color="blue.500"
                                    target="_blank"
                                    rel="noopener noreferrer" // Include this for security
                                >
                                    Model Demo
                                </Link>
                            </Text>
                            {/* Add more links as needed */}
                        </VStack>
                    </Box>
                </Collapse>
            </Flex>

            <form onSubmit={handleFormSubmit}> {/* Add form element and handle form submission */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "start",
                        marginBottom:"10px",
                        marginLeft:"30px",
                        marginTop:"10px"
                    }}
                >

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    justifyContent: "space-around"
                }}>

                    <div style={{marginRight: "0px"}} >
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={continueDrawing}
                            onMouseUp={endDrawing}
                            onMouseLeave={endDrawing}
                            style={{marginBottom: "15px", outline: "1px solid black"}}
                            width={400}
                            height={400}
                        />

                        <div>

                            <div>

                                <Button
                                    onClick={undo}
                                    colorScheme="gray"
                                    mr={2}
                                    disabled={historyIndex - 1 < 0}
                                    leftIcon={<FaUndo/>}
                                >
                                    Undo
                                </Button>

                                <Button
                                    onClick={redo}
                                    colorScheme="gray"
                                    mr={2}
                                    disabled={historyIndex + 1 >= drawingHistory.length}
                                    rightIcon={<FaRedo/>}
                                >
                                    Redo
                                </Button>

                                <Button onClick={clearCanvas} colorScheme="red" mr={2}>
                                    Clear Canvas
                                </Button>

                            </div>


                        </div>

                        <div>

                            <Box p="4" borderWidth="1px" borderRadius="lg" overflow="hidden" mt="15px">

                                <Flex justifyContent="space-between">

                                    <div>

                                        <Text fontSize="lg" fontWeight="bold" marginBottom="2">Draw Color</Text>

                                        <div
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                backgroundColor: drawColor,
                                                marginTop: "10px",
                                                borderRadius: "4px",
                                                border: "1px solid #000",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setShowColorPicker(!showColorPicker)}
                                        ></div>

                                    </div>

                                    <div style={{
                                        borderLeft: "3px solid black",
                                        height: "50px",
                                        marginRight: "10px",
                                        marginTop: "10px"
                                    }}></div>


                                    {squareColors.map((color, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: "relative",
                                                width: "50px",
                                                height: "50px",
                                                backgroundColor: color,
                                                marginTop: "10px",
                                                borderRadius: "4px",
                                                cursor: "pointer", // Add cursor style to indicate clickable area
                                            }}
                                            onClick={() => setDrawColor(color)} // Set drawColor as the clicked color
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: "2px",
                                                    left: "2px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click from reaching the background div
                                                    saveColor(index);
                                                }}
                                            >
                                                <FaSave style={{ color: "white", }} />
                                            </div>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: "2px",
                                                    right: "2px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click from reaching the background div
                                                    deleteSquare(index);
                                                }}
                                            >
                                                <FaTrash
                                                    style={{
                                                        color: "white",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        colorScheme="teal"
                                        size="sm"
                                        fontSize="lg"
                                        fontWeight="bold"
                                        width="50px"
                                        height="50px"
                                        marginTop="10px"
                                        borderRadius="4px"
                                        onClick={addSquare}
                                    >
                                        +
                                    </Button>
                                </Flex>

                                <div  style={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    flexDirection: "row",
                                    justifyContent: "space-around"
                                }}>

                                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                                        {showColorPicker && (
                                            <ChromePicker
                                                color={drawColor}
                                                onChange={(newColor) => setDrawColor(newColor.hex)}
                                            />
                                        )}
                                    </div>


                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Button
                                            colorScheme={isFillTool ? 'blue' : 'gray'}
                                            onClick={() => setIsFillTool(!isFillTool)}
                                            mt={2}
                                            mb={2}
                                            leftIcon={isFillTool ? <FaFill /> : <FaPencilAlt />}
                                        >
                                            {isFillTool ? 'Fill' : 'Draw'}
                                        </Button>
                                        <div>
                                            <select
                                                value={penSize}
                                                onChange={handlePenSizeChange}
                                                size="sm"
                                                disabled={loading}
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: 'gray.200',
                                                    borderWidth: '1px',
                                                    borderRadius: 'md',
                                                    paddingLeft: '0.5rem',
                                                    // Remove the colorScheme prop
                                                }}
                                            >
                                                <option value="1">1px</option>
                                                <option value="5">5px</option>
                                                <option value="10">10px</option>
                                                <option value="20">20px</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                            </Box>

                        </div>

                    </div>

                    <div style={{marginTop: "100px", marginRight:"0px"}}>

                        <Box p="4" borderWidth="1px" borderRadius="lg" overflow="hidden" mt="20px" mr={"20px"}
                             mb={"10px"}>

                            <Text> Style:</Text>

                            <Flex justifyContent="space-between">
                                <Button
                                    colorScheme={activeStyleButton === 'Cartoon' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Cartoon')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Cartoon
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === 'Realistic' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Realistic')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Realistic
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === 'Cinematic' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Cinematic')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Cinematic
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === 'Professional' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Professional')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Professional
                                </Button>
                            </Flex>

                            <Flex justifyContent="space-between">

                                <Button
                                    colorScheme={activeStyleButton === 'Neonpunk' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Neonpunk')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Neonpunk
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === 'Pixel Art' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Pixel Art')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Pixel Art
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === '3D Model' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('3D Model')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    3D Model
                                </Button>
                                <Button
                                    colorScheme={activeStyleButton === 'Photographic' ? 'blue' : 'gray'}
                                    onClick={() => handleStyleButtonClick('Photographic')}
                                    mt={2}
                                    mr={2}
                                    ml={2}
                                >
                                    Photographic
                                </Button>
                            </Flex>
                        </Box>

                        <Wrap marginBottom={"10px"}>
                            <Input
                                value={prompt}
                                onChange={(e) => updatePrompt(e.target.value)}
                                width={"350px"}
                            />
                            <Button type="submit" colorScheme={"teal"}
                                    disabled={loading}
                            //        leftIcon={linkType ? <FaPaintbrush/> : <FaTruckLoading/>}
                            >
                                Generate
                            </Button>

                        </Wrap>

                        {loading && !error && <Text color="black">Generating ...</Text>}
                        {error && <Text color="red">Error during generation, server offline?</Text>}

                        {/*
                        <div className="progress-container">
                            <div className="progress-bar"
                                 style={{width: `${progress}%`, backgroundColor: error ? "red" : "#007bff"}}></div>
                            <span className="progress-label" style={{color: progress > 50 ? "white" : "black"}}>
                              {error ? 'Error' : `${progress}%`}
                            </span>
                        </div>
                        */}

                    </div>


                    <div>
                        <div style={{zIndex: 1}}>
                            <Box
                                style={{
                                    marginBottom: '15px',
                                    outline: '1px solid black',
                                    backgroundColor: 'white',
                                    width: 400,
                                    height: 400,
                                    position: 'relative',
                                    cursor: "pointer"
                                }}
                                onClick={toggleOverlay}
                            >
                                {loading && (
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        width="100%"
                                        height="100%"
                                        backgroundColor="rgba(0, 0, 0, 0.5)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <CircularProgress isIndeterminate color="blue.300" />
                                    </Box>
                                )}
                                {image ? (
                                    <div style={{ width: 400, height: 400}}>
                                        <ChakraImage
                                            src={`data:image/png;base64,${image}`}
                                            boxShadow="lg"
                                            width={400}
                                            height={400}
                                            objectFit="cover"
                                        />
                                    </div>
                                ) : (
                                    <div style={{ width: 400, height: 400}}></div>
                                )}
                            </Box>
                        </div>


                        <div style={{zIndex: 2}}>

                            {/* History section */}
                            {showDrawingHistory && (

                                <Box
                                    bg="white"
                                    p={4}
                                    position="absolute"
                                    top="56px" /* Adjust this value to align with the top bar */
                                    right="0"
                                    shadow="md"
                                    border="1px solid #ccc"
                                    borderBottom="1px solid #ccc" /* Add a clear separator (border) */
                                >
                                    <div>

                                        <div style={{ fontWeight: "bold", marginTop: "2pt", fontSize: "12pt" }}>
                                            Drawing History
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            {drawingHistory.map((historyItem, index) => (
                                                <div key={index} style={{ width: "50px", height: "50px", margin: "5px" }}>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleHistoryClick(index)}
                                                        style={{ display: "block", width: "100%", height: "100%" }}
                                                    >
                                                        <img
                                                            src={historyItem}
                                                            alt={`Image ${index}`}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover", border: "1px solid #000", }}
                                                        />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        <span>
                                Entries: {drawingHistory.length}
                            </span>

                                        <span style={{ marginLeft: "20px" }}>
                                Index: {historyIndex + 1}
                            </span>

                                    </div>

                                    <div>

                                        <div style={{ fontWeight: "bold", marginTop: "2pt", fontSize: "12pt" }}>
                                            Generation History
                                        </div>

                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                            {generationHistory.map((historyItem, index) => (
                                                <div key={index} style={{ width: "50px", height: "50px", margin: "5px" }}>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleGenerationHistoryClick(index)}
                                                        style={{ display: "block", width: "100%", height: "100%" }}
                                                    >
                                                        <img
                                                            src={`data:image/png;base64,${historyItem}`}
                                                            alt={`Image ${index}`}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover", border: "1px solid #000", }}
                                                        />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        <span>
                                Entries: {generationHistory.length}
                            </span>

                                        <span style={{ marginLeft: "20px" }}>
                                Index: {generationIndex + 1}
                            </span>

                                    </div>

                                </Box>
                            )}
                        </div>


                        <div>

                            <Button onClick={drawGeneratedImage} colorScheme="teal" mt={0} mr={2}>
                                To Canvas
                            </Button>

                            <Button onClick={saveCanvasImage} colorScheme="blue" mt={0} mr={2}>
                                Save Drawing
                            </Button>

                            <Button onClick={saveAIImage} colorScheme="blue" mt={0} mr={2}>
                                Save AI Image
                            </Button>

                        </div>

                        <div style={{ marginTop: "15px" }}>
                            <Box p="4" borderWidth="1px" borderRadius="lg" overflow="hidden">
                                <Stack spacing={4}>

                                    <Tooltip label={'Also called "Guidance Scale"'} placement="top">
                                        <Text>
                                            Prompt Importance: {guidanceScale}
                                        </Text>
                                    </Tooltip>

                                    <Slider
                                        value={guidanceScale}
                                        onChange={(value) => updateGuidanceScale(value)}
                                        min={0.1}
                                        max={30}
                                        step={0.1}
                                        width={350}
                                        className="teal-slider"
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                    <Tooltip label={'Also called "Adapter Conditioning Scale"'} placement="top">
                                        <Text>
                                            Drawing Similarity: {adapterConditioningScale}
                                        </Text>
                                    </Tooltip>
                                    <Slider
                                        value={adapterConditioningScale}
                                        onChange={(value) => updateAdapterConditioningScale(value)}
                                        min={0.5}
                                        max={1}
                                        step={0.1}
                                        width={350}
                                        className="teal-slider"
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                    <Tooltip label={'Also called "Adapter Conditioning Factor"'} placement="top">
                                        <Text>
                                            Drawing Similarity Factor: {adapterConditioningFactor}
                                        </Text>
                                    </Tooltip>
                                    <Slider
                                        value={adapterConditioningFactor}
                                        onChange={(value) => updateAdapterConditioningFactor(value)}
                                        min={0.5}
                                        max={1}
                                        step={0.1}
                                        width={350}
                                        className="teal-slider"
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Stack>
                            </Box>
                        </div>

                    </div>

                </div>

            </form>


            <div style={{ position: "relative" }}>
                {showOverlay && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                        }}
                        onClick={toggleOverlay}
                    >
                        <img
                            src={`data:image/png;base64,${image}`}
                            alt="Generated Image"
                            style={{ maxWidth: "90%", maxHeight: "90%" }}
                        />
                    </div>
                )}

            </div>



        </ChakraProvider>
    );
};

export default App;
