import { ChainId } from '@usedapp/core';

export const getEtherscanLink = (address: string, chainId: ChainId): string => {
  const network = ChainId[chainId].toLowerCase();
  return `https://${network}.etherscan.io/address/${address}`;
};
