import { useContractFunction } from '@usedapp/core';

import { lotteryContract } from '~/lib/contract';

export const useBuyTicket = () => {
  return useContractFunction(lotteryContract, 'buyTicket');
};
