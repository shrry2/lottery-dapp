import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC } from 'react';

import { useTicketsOf } from '~/features/Lottery/contract/useTicketsOf';

type MyTicketModalButtonProps = {
  account: string;
};

export const MyTicketModalButton: FC<MyTicketModalButtonProps> = ({
  account,
}: MyTicketModalButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myTicketCount = useTicketsOf(account);

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        My Tickets
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Tickets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="3xl" textAlign="center" mb="3">
              {myTicketCount && myTicketCount.gt(0) ? (
                <>
                  You have {myTicketCount?.toString()} tickets.
                  <br />
                  Good luck to you!
                </>
              ) : (
                `You don't have tickets.`
              )}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
