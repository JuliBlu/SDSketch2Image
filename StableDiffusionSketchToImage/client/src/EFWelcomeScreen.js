import React from "react";
import {
    Heading,
    Text,
    Button,
    Box,
    Flex,
    Icon,
    Spacer,
    IconButton,
    ChakraProvider
} from "@chakra-ui/react";
import img from "./images/img.png"; // Adjust the path and file extension accordingly


import { FaPaintBrush, FaChartPie, FaInfoCircle, FaTimes } from "react-icons/fa";

const EFWelcomeScreen = ({ onStart, onLearnMore }) => (
    <div
        style={{
            marginTop: "20px",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "0px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            color: "teal",
            margin: "0 auto",
        }}
    >

        <div>
            <Flex alignItems="end" justifyContent="flex-end">
                <IconButton
                    aria-label="Close"
                    icon={<Icon as={FaTimes} />}
                    size="md" // Increase the size to make it a little bigger
                    borderRadius="2px" // Rounded corners of 2px
                    backgroundColor="teal" // Background color teal
                    color="white" // Set the color to white for the cross
                    _hover={{
                        backgroundColor: "teal.500", // Teal on hover
                    }}
                    onClick={() => {
                        // Handle close button logic here
                        console.log('Close button clicked');
                    }}
                />
            </Flex>
        </div>

        <Flex alignItems="center" justifyContent="space-around">
            {/* Left side (square image holder) */}
            <div
                style={{
                    width: "500px", // Adjust the width as needed
                    height: "500px", // Make it a square by setting the height equal to the width
                    backgroundColor: "gray", // Placeholder background color
                }}
            >
                <img
                    src={img} // Add your image URL here
                    alt="Your Image"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Right side */}
            <div
                style={{
                    // Other styles for the container...
                    whiteSpace: "normal", // Allow text to wrap to the next line
                    wordWrap: "break-word", // Allow breaking long words
                }}
            >
                <Heading fontWeight="bold">Bold Heading</Heading>
                <Heading fontWeight="semibold">Semibold Heading</Heading>
                <Text marginBottom="20px">Immer wieder müssen im beruflichen Alltag Bilder erstellt
                    werden.

                    Oft haben wir dabei nicht nur ein Motiv vorgegeben,
                    sondern auch eine Vorstellung davon wie dieses am Ende
                    aussehen soll.
                    Neben der rein textbasierten Interaktion mit KI ist es
                    möglich, diese Vorstellung durch Zeichnungen an die KI zu
                    kommunizieren. Insbesondere die Wahl und Platzierung von
                    Farben wird bei der Bildgenerierung dann berücksichtigt.</Text>
                <Button
                    fontSize="2xl"
                    padding="25px 40px"
                    colorScheme="teal"
                    onClick={onStart}
                    _hover={{
                        transform: "scale(1.05)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                    _active={{
                        transform: "scale(0.95)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                >
                    E&F
                </Button>
            </div>
        </Flex>


    </div>
);

export default EFWelcomeScreen;
