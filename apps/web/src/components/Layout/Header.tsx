import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Link,
  Popover,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import NextLink from 'next/link';
import { FC } from 'react';

import { routes } from '~/config';
import { MyTicketModalButton } from '~/features/Lottery/components';
import { WalletModalButton } from '~/features/Wallet/components';

export const Header: FC = () => {
  const { isOpen, onToggle } = useDisclosure();

  const { account, activateBrowserWallet } = useEthers();

  return (
    <Box>
      <Flex
        bg="blackAlpha.600"
        color="white"
        py={{ base: 4 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify="start">
          <NextLink href={routes.home} passHref>
            <Link
              fontFamily="heading"
              textTransform="uppercase"
              fontWeight="bold"
              _hover={{
                textDecoration: 'none',
                color: 'gray.200',
              }}
              mr={2}
            >
              The Lottery
            </Link>
          </NextLink>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={4}
        >
          {account ? (
            <>
              <MyTicketModalButton account={account} />
              <WalletModalButton />
            </>
          ) : (
            <Button colorScheme="green" onClick={() => activateBrowserWallet()}>
              Connect Wallet
            </Button>
          )}
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            aria-label="Toggle Navigation"
            colorScheme="white"
            display={{ base: 'flex', md: 'none' }}
          />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <NextLink href={navItem.href} passHref>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'md'}
                fontWeight={500}
                color="white"
                _hover={{
                  textDecoration: 'none',
                  color: 'gray.200',
                }}
              >
                {navItem.label}
              </Link>
            </NextLink>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg="blackAlpha.600"
      p={4}
      display={{ md: 'none' }}
      borderTop="1px solid #888"
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <NextLink href={href} passHref>
        <Flex
          py={2}
          as={Link}
          href={href}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Text fontWeight={600} color="white">
            {label}
          </Text>
        </Flex>
      </NextLink>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'About',
    href: routes.about,
  },
];
