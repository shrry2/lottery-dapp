import { Button, useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';

import { WalletModal } from '~/features/Wallet/components/WalletModal';

export const WalletModalButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Wallet
      </Button>

      <WalletModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
