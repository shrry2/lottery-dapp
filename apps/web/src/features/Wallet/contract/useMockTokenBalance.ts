import { ChainId, useEthers, useTokenBalance } from '@usedapp/core';

import { addresses } from '~/config';

export const useMockTokenBalance = () => {
  const { account } = useEthers();
  return useTokenBalance(addresses.mockToken[ChainId.Goerli], account);
};
