import { useCall } from '@usedapp/core';
import { BigNumber } from 'ethers';

import { lotteryContract } from '~/lib/contract';

export const useCurrentJackpot = (): BigNumber => {
  const callResult = useCall({
    contract: lotteryContract,
    method: 'currentPrizePoolAmount',
    args: [],
  });

  if (callResult?.error) {
    console.error(callResult.error);
    return BigNumber.from(0);
  }

  return callResult?.value[0] || BigNumber.from(0);
};
