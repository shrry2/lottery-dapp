import { useCall } from '@usedapp/core';

import { lotteryContract } from '~/lib/contract';

export const usePastLotteryCount = (): number => {
  const callResult = useCall({
    contract: lotteryContract,
    method: 'pastLotteryCount',
    args: [],
  });

  if (callResult?.error) {
    console.error(callResult.error);
    return 0;
  }

  return callResult?.value[0].toNumber() || 0;
};
