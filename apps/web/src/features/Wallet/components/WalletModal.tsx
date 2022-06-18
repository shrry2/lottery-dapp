import {
  Alert,
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
import React, { FC } from 'react';

import { UnsupportedChainAlert } from '~/features/Wallet/components/UnsupportedChainAlert';
import { useMockTokenBalance } from '~/features/Wallet/contract/useMockTokenBalance';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const WalletModal: FC<WalletModalProps> = ({
  isOpen,
  onClose,
}: WalletModalProps) => {
  const { chainId, deactivate, account } = useEthers();
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

                {chainId !== ChainId.Goerli ? <UnsupportedChainAlert /> : null}
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
                  {mockTokenBalance ? formatTokenAmount(mockTokenBalance) : 0}{' '}
                  MOK
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
