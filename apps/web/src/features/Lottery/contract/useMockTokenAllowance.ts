import { ChainId, useEthers, useTokenAllowance } from '@usedapp/core';

import { addresses } from '~/config';

export const useMockTokenAllowance = () => {
  const { account } = useEthers();
  return useTokenAllowance(
    addresses.mockToken[ChainId.Goerli],
    account,
    addresses.lottery[ChainId.Goerli]
  );
};
