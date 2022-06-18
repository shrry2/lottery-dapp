import { useCall } from '@usedapp/core';

import { usePastLotteryCount } from '~/features/Lottery/contract/usePastLotteryCount';
import { lotteryContract } from '~/lib/contract';

export const usePreviousLottery = () => {
  const pastLotteryCount = usePastLotteryCount();
  const callResult = useCall({
    contract: lotteryContract,
    method: 'pastLotteries',
    args: [pastLotteryCount > 0 ? pastLotteryCount - 1 : 0],
  });

  if (callResult?.error) {
    console.error(callResult.error);
    return null;
  }

  return callResult?.value || null;
};
