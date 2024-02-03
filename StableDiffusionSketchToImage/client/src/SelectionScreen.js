import React, { useState } from "react";
import { Container, Heading, Button, ButtonGroup, Box, Text, Input } from "@chakra-ui/react";
import { FaPen, FaPaintBrush, FaEraser, FaFill } from "react-icons/fa";
import "./styles/SelectionScreen.css"; // Import your CSS file

const SelectionScreen = ({ onEnterMainApp }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedSmallButton, setSelectedSmallButton] = useState(null);
    const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true);
    const [customIdea, setCustomIdea] = useState("");

    const handleButtonSelect = (button) => {
        setSelectedButton(button);
        setSelectedSmallButton(null);
    };

    const handleSmallButtonSelect = (button) => {
        setSelectedSmallButton(button);
        setIsStartButtonDisabled(false);
    };

    const handleCustomIdeaChange = (event) => {
        setCustomIdea(event.target.value);
        setSelectedSmallButton(event.target.value);
    };

    const isSmallButtonDisabled = (button) => {
        return selectedButton !== button;
    };

    const renderSubButtons = () => {
        if (!selectedButton) {
            return null;
        }

        const subButtonColors = {
            opt1: "red",
            opt2: "green",
            opt3: "blue",
        };

        if (selectedButton === "opt3") {
            return (
                <Box className="sub-button-container">
                    <Text fontSize="lg" marginBottom="5px">
                        Gib deine eigene Idee ein:
                    </Text>
                    <Input
                        value={customIdea}
                        onChange={handleCustomIdeaChange}
                        placeholder="Deine Idee..."
                        size="sm"
                        width="100%"
                    />
                </Box>
            );
        }

        const smallButtonLabels = {

            opt11: "Windräder",
            opt12: "Datensicherheit",
            opt13: "Mobilitätskonzepte",
            opt14: "Marktanalyse",

            opt21: "Mobilität",
            opt22: "Zukunftsarbeit",
            opt23: "Erholung",
            opt24: "New Work",

        };

        return (
            <Box className="sub-button-container">
                <Text fontSize="lg" marginBottom="5px">
                    Wähle ein Thema/Motiv:
                </Text>
                <ButtonGroup spacing={2}>

                    <Button
                        size="sm"
                        colorScheme={subButtonColors[selectedButton]}
                        width="100%"
                        className={selectedSmallButton !== null && selectedSmallButton !== selectedButton+"1" && "fade-out"}
                        onClick={() => handleSmallButtonSelect(selectedButton+"1")}
                    >
                        {smallButtonLabels[selectedButton+"1"]}
                    </Button>

                    <Button
                        size="sm"
                        colorScheme={subButtonColors[selectedButton]}
                        width="100%"
                        className={selectedSmallButton !== null && selectedSmallButton !== selectedButton+"2" && "fade-out"}
                        onClick={() => handleSmallButtonSelect(selectedButton+"2")}
                    >
                        {smallButtonLabels[selectedButton+"2"]}
                    </Button>

                    <Button
                        size="sm"
                        colorScheme={subButtonColors[selectedButton]}
                        width="100%"
                        className={selectedSmallButton !== null && selectedSmallButton !== selectedButton+"3" && "fade-out"}
                        onClick={() => handleSmallButtonSelect(selectedButton+"3")}
                    >
                        {smallButtonLabels[selectedButton+"3"]}
                    </Button>

                    <Button
                        size="sm"
                        colorScheme={subButtonColors[selectedButton]}
                        width="100%"
                        className={((selectedSmallButton !== null && selectedSmallButton) !== selectedButton+"4") && "fade-out"}
                        onClick={() => handleSmallButtonSelect(selectedButton+"4")}
                    >
                        {smallButtonLabels[selectedButton+"4"]}
                    </Button>

                </ButtonGroup>
                <div>
                    {selectedButton && (
                        <Text fontSize="md" marginTop="10px">
                            Großer Button: {selectedButton +" | "+((selectedSmallButton !== null && selectedSmallButton) !== selectedButton+"3")}
                            <br />
                            Kleiner Button: {selectedSmallButton}
                        </Text>
                    )}
                </div>
            </Box>


        );
    };

    return (
        <Container textAlign="center" marginTop="100px">
            <Heading>Was gestaltest du heute ?</Heading>
            <div>
                <ButtonGroup spacing={4} flexDirection="column">
                    <Button
                        leftIcon={<FaPen />}
                        size="lg"
                        colorScheme="red"
                        className={`sub-button ${selectedButton !== null && selectedButton !== "opt1" && "fade-out"}`}
                        onClick={() => handleButtonSelect("opt1")}
                        marginTop="10px"
                        marginLeft="16px"
                        width="100%"
                    >
                        Eine Illustration für eine Präsentation
                    </Button>
                    <Button
                        leftIcon={<FaPaintBrush />}
                        size="lg"
                        colorScheme="green"
                        className={`sub-button ${selectedButton !== null && selectedButton !== "opt2" && "fade-out"}`}
                        onClick={() => handleButtonSelect("opt2")}
                        marginTop="10px"
                        width="100%"
                    >
                        Ein Marketingplakat
                    </Button>
                    <Button
                        leftIcon={<FaEraser />}
                        size="lg"
                        colorScheme="blue"
                        className={`sub-button ${selectedButton !== null && selectedButton !== "opt3" && "fade-out"}`}
                        onClick={() => handleButtonSelect("opt3")}
                        marginTop="10px"
                        width="100%"
                    >
                        Eine eigene Idee
                    </Button>
                    {renderSubButtons()}
                    <Button
                        size="lg"
                        colorScheme="teal"
                        onClick={onEnterMainApp}
                        marginTop="20px"
                        width="100%"
                        disabled={isStartButtonDisabled}
                    >
                        Start
                    </Button>
                </ButtonGroup>
            </div>



        </Container>



    );
};

export default SelectionScreen;
