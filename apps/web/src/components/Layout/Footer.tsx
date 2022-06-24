import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, Link, useBreakpointValue } from '@chakra-ui/react';
import { ChainId } from '@usedapp/core';
import { FC } from 'react';

import { addresses } from '~/config';
import { getEtherscanLink } from '~/lib/etherscan';

export const Footer: FC = () => {
  return (
    <Flex
      flexDirection={useBreakpointValue({
        base: 'column',
        sm: 'row',
      })}
      as="footer"
      justifyContent="center"
      alignItems="center"
      bg="blackAlpha.600"
      color="white"
      p={3}
      mt="auto"
      gap={useBreakpointValue({
        base: 1,
        sm: 5,
      })}
    >
      <p>Network: {ChainId[ChainId.Goerli]}</p>
      <p>
        Address:{' '}
        <Link
          href={getEtherscanLink(
            addresses.lottery[ChainId.Goerli],
            ChainId.Goerli
          )}
          isExternal
          wordBreak="break-all"
        >
          {addresses.lottery[ChainId.Goerli]} <ExternalLinkIcon mx="2px" />
        </Link>
      </p>
    </Flex>
  );
};
