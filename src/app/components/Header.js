'use client';
import {Box, Flex, Container, IconButton, useColorMode} from "@chakra-ui/react";
import {LuMoon, LuSun} from 'react-icons/lu';
import {ColorModeButton} from "@/app/components/ui/color-mode";

export default function Header() {
    return (
        <Box as="header" py={1} borderBottomWidth="1px">
            <Container maxW={{base: "100%", md: "1000px"}} px={{base: 4, md: 6}}>
                <Flex justify="space-between" align="center">
                    <Box fontWeight="bold">Recovery Inventories</Box>
                    <ColorModeButton/>
                </Flex>
            </Container>
        </Box>
    );
}
