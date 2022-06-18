import { useContractFunction } from '@usedapp/core';

import { lotteryContract } from '~/lib/contract';

export const usePastLotteryCount = () => {
  return useContractFunction(lotteryContract, 'pastLotteryCount');
};
