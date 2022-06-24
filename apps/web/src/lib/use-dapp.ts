import { Config, Goerli } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

export const useDappConfig: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: getDefaultProvider('goerli'),
  },
};
