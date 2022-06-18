import { Center, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import { addMinutes, fromUnixTime } from 'date-fns';
import { FC } from 'react';

import { supportedChains } from '~/config';
import { FeatureCard } from '~/features/Lottery/components';
import { BuyTicketButton } from '~/features/Lottery/components/BuyTicketButton';
import { useCurrentJackpot } from '~/features/Lottery/contract/useCurrentJackpot';
import { usePreviousLottery } from '~/features/Lottery/contract/usePreviousLottery';
import { useTicketPrice } from '~/features/Lottery/contract/useTicketPrice';
import { UnsupportedChainAlert } from '~/features/Wallet/components';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export const Dashboard: FC = () => {
  const currentJackpot = useCurrentJackpot();
  const ticketPrice = useTicketPrice();
  const previousLottery = usePreviousLottery();

  const { chainId } = useEthers();

  if (!supportedChains.includes(chainId as number)) {
    return <UnsupportedChainAlert />;
  }

  return (
    <SimpleGrid columns={[1, null, 2]} spacing={10}>
      <VStack spacing={10}>
        <FeatureCard heading="Current Jackpot">
          <Text
            color="yellow"
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
          >
            {formatTokenAmount(currentJackpot)} MOK
          </Text>
        </FeatureCard>

        <FeatureCard heading="Previous Jackpot">
          <Text textAlign="center" fontSize="3xl" fontWeight="bold">
            {previousLottery
              ? `${formatTokenAmount(previousLottery.jackpot)} MOK`
              : 'No Previous Lottery'}
          </Text>
        </FeatureCard>

        <FeatureCard heading="Winning Ticket">
          <Text textAlign="center" fontSize="3xl" fontWeight="bold">
            {previousLottery
              ? previousLottery.winningTicket.toString()
              : 'No Previous Lottery'}
          </Text>
        </FeatureCard>
      </VStack>

      <VStack spacing={10}>
        <FeatureCard heading="Ticket Price">
          <Text
            color="yellow"
            textAlign="center"
            fontSize="3xl"
            fontWeight="bold"
          >
            {typeof ticketPrice !== 'undefined'
              ? formatTokenAmount(ticketPrice).toString()
              : '...'}{' '}
            MOK
          </Text>
          <Center mt={3}>
            <BuyTicketButton />
          </Center>
        </FeatureCard>

        <FeatureCard heading="Locked Until">
          <Text textAlign="center" fontSize="3xl" fontWeight="bold">
            {previousLottery
              ? addMinutes(
                  fromUnixTime(previousLottery.drawnTimestamp.toNumber()),
                  5
                ).toString()
              : 'Not Locked'}
          </Text>
        </FeatureCard>
      </VStack>
    </SimpleGrid>
  );
};
