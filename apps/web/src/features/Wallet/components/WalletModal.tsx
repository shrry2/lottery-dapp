import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';
import { ChainId, useEthers } from '@usedapp/core';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC } from 'react';

import { useMockTokenBalance } from '~/features/Wallet/hooks/useMockTokenBalance';

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const WalletModal: FC<WalletModalProps> = ({
  isOpen,
  onClose,
}: WalletModalProps) => {
  const { chainId, deactivate, account, switchNetwork } = useEthers();
  const mockTokenBalance = useMockTokenBalance();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {account ? (
            <VStack alignItems="flex-start" wordBreak="break-word" gap="4">
              <Box>
                <Heading size="md" mb="1">
                  Chain
                </Heading>
                <code>{chainId ? ChainId[chainId] : 'Loading...'}</code>

                {chainId !== ChainId.Goerli ? (
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
                ) : null}
              </Box>

              <Box>
                <Heading size="md" mb="1">
                  Wallet Address
                </Heading>
                <code>{account}</code>
              </Box>

              <Box>
                <Heading size="md" mb="1">
                  MockToken Balance
                </Heading>
                <code>
                  {mockTokenBalance ? formatUnits(mockTokenBalance, 18) : 0} MOK
                </code>
              </Box>
            </VStack>
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Wallet is not connected</AlertTitle>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter justifyContent="flex-start">
          <Button colorScheme="blackAlpha" onClick={() => deactivate()}>
            Disconnect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
