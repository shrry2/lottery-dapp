import { useCall } from '@usedapp/core';
import { BigNumber } from 'ethers';

import { lotteryContract } from '~/lib/contract';

export const useTicketsOf = (walletAddress: string): BigNumber | undefined => {
  const callResult = useCall({
    contract: lotteryContract,
    method: 'ticketsOf',
    args: [walletAddress],
  });

  if (callResult?.error) {
    console.error(callResult.error);
    return undefined;
  }

  return callResult?.value[0];
};
