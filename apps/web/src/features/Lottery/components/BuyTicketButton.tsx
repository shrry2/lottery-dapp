import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ChainId } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { FC, useState } from 'react';

import { addresses } from '~/config';
import { useApproveMockToken } from '~/features/Lottery/contract/useApproveMockToken';
import { useBuyTicket } from '~/features/Lottery/contract/useBuyTicket';
import { useMockTokenAllowance } from '~/features/Lottery/contract/useMockTokenAllowance';
import { useTicketPrice } from '~/features/Lottery/contract/useTicketPrice';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export const BuyTicketButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ticketPrice = useTicketPrice();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const mockTokenAllowance = useMockTokenAllowance();
  const approveMockToken = useApproveMockToken();
  const buyTicket = useBuyTicket();

  const [isLoading, setIsLoading] = useState(false);

  const handleBuyTicketButtonClick = async () => {
    if (isLoading || typeof ticketPrice === 'undefined' || ticketQuantity < 1) {
      return;
    }

    const totalPrice = ticketPrice.mul(ticketQuantity);

    // check allowance
    if (typeof mockTokenAllowance === 'undefined') {
      alert('Failed to load MockToken allowance');
      return;
    }

    setIsLoading(true);

    try {
      if (mockTokenAllowance.lt(totalPrice)) {
        const approveMockTokenResult = await approveMockToken.send(
          addresses.lottery[ChainId.Goerli],
          totalPrice
        );

        if (!approveMockTokenResult || approveMockTokenResult?.status !== 1) {
          console.error('approve mock token failed');
          return;
        }
      }

      // buy tickets
      await buyTicket.send(ticketQuantity);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        colorScheme="green"
        size="lg"
        textTransform="uppercase"
        fontWeight="bold"
        onClick={onOpen}
      >
        Buy
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy Tickets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {typeof ticketPrice === 'undefined' ? (
              <div>Loading ticket price...</div>
            ) : (
              <VStack spacing={5} pb={3}>
                <VStack>
                  <Heading size="lg" textTransform="uppercase">
                    Ticket Price
                  </Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="yellow.500">
                    {formatTokenAmount(ticketPrice)} MOK
                  </Text>
                </VStack>

                <FormControl>
                  <FormLabel htmlFor="ticketQuantity">
                    Ticket Quantity
                  </FormLabel>
                  <Select
                    id="ticketQuantity"
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Number(e.target.value))}
                  >
                    {Array.from(Array(10).keys()).map((i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <HStack fontSize="2xl">
                  <Text>Total MOK:</Text>
                  <Text>
                    {formatTokenAmount(
                      ticketPrice.mul(BigNumber.from(ticketQuantity))
                    )}
                  </Text>
                </HStack>

                <Button
                  colorScheme="green"
                  size="lg"
                  textTransform="uppercase"
                  fontWeight="bold"
                  w="100%"
                  isLoading={isLoading}
                  onClick={handleBuyTicketButtonClick}
                >
                  Buy
                </Button>

                {isLoading ? (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertTitle>
                      Metamask prompt will be shown twice. Please confirm both
                      of them.
                    </AlertTitle>
                  </Alert>
                ) : null}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
