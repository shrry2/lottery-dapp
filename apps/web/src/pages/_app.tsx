import { Box, ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { Header } from '~/components/Layout';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>Lottery DApp</title>
      </Head>
      <Box
        bgImage="url('/bg.jpg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minH="100vh"
      >
        <Header />
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
};

export default App;
