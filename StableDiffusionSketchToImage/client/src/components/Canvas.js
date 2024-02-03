import React, { useRef, useEffect } from "react";

const Canvas = ({ penSize, isDrawing, drawColor, isFillTool, drawingHistory, historyIndex, undo, redo }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 400; // Set the desired width of the canvas
        canvas.height = 400; // Set the desired height of the canvas
        const context = canvas.getContext("2d");
        context.scale(1, 1);
        context.lineCap = "round";
        context.strokeStyle = drawColor;
        context.lineWidth = penSize;
        contextRef.current = context;

        // Clear the canvas when the component mounts
        clearCanvas();
    }, [drawColor, penSize]);

    const startDrawing = ({ nativeEvent }) => {
        if (!isDrawing && !isFillTool) {
            const { offsetX, offsetY } = nativeEvent;
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
        }
    };

    const continueDrawing = ({ nativeEvent }) => {
        if (isDrawing) {
            const { offsetX, offsetY } = nativeEvent;
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        }
    };

    const endDrawing = () => {
        if (isDrawing) {
            contextRef.current.closePath();
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // ... other canvas-related functions

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={continueDrawing}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            style={{ marginTop: "10px", marginBottom: "10px", border: "1px solid black" }}
            width={400}
            height={400}
        />
    );
};

export default Canvas;
