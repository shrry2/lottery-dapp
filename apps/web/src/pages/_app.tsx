import { Box, ChakraProvider, Container, Flex } from '@chakra-ui/react';
import { DAppProvider } from '@usedapp/core';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { Footer, Header } from '~/components/Layout';
import { useDappConfig } from '~/lib/use-dapp';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <DAppProvider config={useDappConfig}>
        <Head>
          <title>Lottery DApp</title>
        </Head>
        <Flex
          flexDirection="column"
          bgImage="url('/bg.jpg')"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          minH="100vh"
        >
          <Box flexShrink="0" pb={10}>
            <Header />
            <Container maxW="container.xl" pt={10}>
              <Component {...pageProps} />
            </Container>
          </Box>
          <Footer />
        </Flex>
      </DAppProvider>
    </ChakraProvider>
  );
};

export default App;
