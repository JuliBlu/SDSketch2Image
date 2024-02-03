import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import WelcomeScreen from "./WelcomeScreen";
import SelectionScreen from "./SelectionScreen"; // Update the import
import MainApp from "./MainApp";
import EFWelcomeScreen from "./EFWelcomeScreen"; // You can import the actual MainApp component from its respective file

const App = () => {
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [showEFWelcomeScreen, setShowEFWelcomeScreen] = useState(false);
    const [showSelectionScreen, setShowSelectionScreen] = useState(false); // Update the state name
    const [showMainApp, setShowMainApp] = useState(false);
    const [showEFMainApp, setShowEFMainApp] = useState(false);

    const handleStart = () => {
        setShowWelcomeScreen(false);
        setShowSelectionScreen(true); // Update the state name
        setShowEFWelcomeScreen(false);
    };

    const handleEnterMainApp = () => {
        setShowSelectionScreen(false); // Update the state name
        setShowWelcomeScreen(false); // Update the state name
        setShowMainApp(true);
        setShowEFWelcomeScreen(false);
    };

    const handleEnterEFWelcomeScreen = () => {
        setShowSelectionScreen(false); // Update the state name
        setShowWelcomeScreen(false); // Update the state name
        setShowEFWelcomeScreen(true); // Update the state name
        setShowMainApp(false);
        setShowEFMainApp(false);
    };

    const handleBackToHome = () => {
        setShowSelectionScreen(false); // Update the state name
        setShowWelcomeScreen(true); // Update the state name
        setShowMainApp(false);
        setShowEFWelcomeScreen(false);
    };

    return (
        <ChakraProvider>
            {showWelcomeScreen && <WelcomeScreen onStart={handleEnterMainApp} onStart2={handleEnterEFWelcomeScreen}/>}
            {showEFWelcomeScreen && <EFWelcomeScreen onStart={handleEnterMainApp} />}
            {showSelectionScreen && ( // Update the condition
                <SelectionScreen onEnterMainApp={handleEnterMainApp} />
            )}
            {showMainApp && <MainApp onHome={handleBackToHome}/>}
        </ChakraProvider>
    );
};

export default App;
