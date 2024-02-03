import React from "react";
import {
    Container,
    Heading,
    Text,
    Button,
    Box,
    Flex,
    Icon,
    Spacer,
} from "@chakra-ui/react";
import { FaPaintBrush, FaChartPie, FaInfoCircle } from "react-icons/fa";

const WelcomeScreen = ({ onStart, onStart2, onLearnMore }) => (
    <Container
        marginTop="100px"
        maxWidth="600px"
        backgroundColor="#1a202c"
        padding="20px"
        borderRadius="10px"
        boxShadow="xl"
        color="white"
    >
        <Heading fontSize="3xl" marginBottom="20px">
            Zeichnung und Text -> Bild Generator
        </Heading>
        <Text
            fontSize="xl"
            lineHeight="1.6"
            textAlign="left"
        >
            Lasse dich von der KI beim Zeichnen unterstützen!​ Manches ist leichter
            zu skizzieren, manches leichter zu erklären. ​ Hier wird aus deiner
            Zeichnung und Beschreibung ein Bild generiert, welches sowohl deine
            Worte, als auch deine Zeichnung berücksichtigt.​
        </Text>
        <Box marginTop="20px" textAlign="center">
            <Button
                fontSize="2xl"
                padding="25px 200px"
                colorScheme="blue"
                onClick={onStart}
                mb={"10px"}
                _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease-in-out",
                }}
                _active={{
                    transform: "scale(0.95)",
                    transition: "transform 0.2s ease-in-out",
                }}
            >
                Start
            </Button>
          
        </Box>
        <Flex
            alignItems="center"
            justifyContent="center"
            marginTop="20px"
            fontSize="xl"
        >
            <Box marginRight="10px">
                <Button
                    leftIcon={<Icon as={FaChartPie} />}
                    colorScheme="teal"
                    variant="link"
                    as="a" // Use "as" prop to render as an anchor tag
                    href="https://frau-hofer.iao.fraunhofer.de?tripetto=3f5be3f6d211b4f4887e215c8f340e085babdd2da72095c13cc7f297bda79f42"
                    target="_blank" // Open link in a new tab
                >
                    Survey
                </Button>
            </Box>
            <Spacer />
            <Box marginLeft="10px">
                <Button
                    leftIcon={<Icon as={FaInfoCircle} />}
                    colorScheme="teal"
                    variant="link"
                    as="a" // Use "as" prop to render as an anchor tag
                    href="https://huggingface.co/"
                    target="_blank" // Open link in a new tab
                >
                    Mehr erfahren
                </Button>
            </Box>
        </Flex>
    </Container>
);

export default WelcomeScreen;
