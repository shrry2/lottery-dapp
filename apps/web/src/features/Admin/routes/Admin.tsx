import {
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';

import { usePastLotteryCount } from '~/features/Lottery/contract/usePastLotteryCount';

export const Admin: NextPage = () => {
  const pastLotteryCount = usePastLotteryCount();

  return (
    <VStack bg="white" alignItems="flex-start" p={5}>
      <Heading size="xl">Admin</Heading>
      <Heading size="lg">Stat</Heading>
      <StatGroup w="100%">
        <Stat>
          <StatLabel>Past Lottery Count</StatLabel>
          <StatNumber>{pastLotteryCount}</StatNumber>
        </Stat>
      </StatGroup>
    </VStack>
  );
};
