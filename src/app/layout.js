import {Provider} from "@/app/components/ui/provider";
import {Box, Container} from "@chakra-ui/react";
import Header from "@/app/components/Header";
import {Suspense} from "react";

export default function RootLayout({children}) {
    return (
        <Suspense fallback={null}>
            <html lang="en">
            <body>
            <Provider>
                <Box as="main" minH="100vh">
                    <Header/>
                    <Container
                        maxW={{base: "100%", md: "1000px"}}
                        px={{base: 4, md: 6}}
                        pt={{base: 4, md: 8}}
                        pb={{base: 4, md: 8}}
                        mx="auto"
                    >
                        {children}
                    </Container>
                </Box>
            </Provider>
            </body>
            </html>
        </Suspense>
    );
}