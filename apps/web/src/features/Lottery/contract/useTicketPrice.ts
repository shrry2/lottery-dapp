import { useCall } from '@usedapp/core';
import { BigNumber } from 'ethers';

import { lotteryContract } from '~/lib/contract';

export const useTicketPrice = (): BigNumber | undefined => {
  const callResult = useCall({
    contract: lotteryContract,
    method: 'ticketPrice',
    args: [],
  });

  if (callResult?.error) {
    console.error(callResult.error);
    return undefined;
  }

  return callResult?.value[0];
};
