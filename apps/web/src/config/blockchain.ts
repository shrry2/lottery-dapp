import { ChainId } from '@usedapp/core';

// Supported chains
export const supportedChains = [ChainId.Goerli] as const;

export type SupportedChain = typeof supportedChains[number];

// Contract addresses
type Contract = 'mockToken' | 'lottery';

export const addresses: {
  [_contract in Contract]: {
    [_chainId in SupportedChain]: string;
  };
} = {
  mockToken: {
    [ChainId.Goerli]: process.env.NEXT_PUBLIC_CONTRACT_MOCK_TOKEN as string,
  },
  lottery: {
    [ChainId.Goerli]: process.env.NEXT_PUBLIC_CONTRACT_LOTTERY as string,
  },
};
