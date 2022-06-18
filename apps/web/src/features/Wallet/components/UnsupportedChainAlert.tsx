import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@chakra-ui/react';
import { ChainId, useEthers } from '@usedapp/core';
import React, { FC } from 'react';

export const UnsupportedChainAlert: FC = () => {
  const { switchNetwork } = useEthers();

  return (
    <Alert status="error" mt="3">
      <AlertIcon />
      <AlertTitle>You are on unsupported chain. </AlertTitle>
      <AlertDescription>
        <Button
          colorScheme="green"
          onClick={() => switchNetwork(ChainId.Goerli)}
        >
          Switch to Goerli
        </Button>
      </AlertDescription>
    </Alert>
  );
};
