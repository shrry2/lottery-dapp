import { BigNumber } from 'ethers';

export const formatTokenAmount = (value: BigNumber): string => {
  const denom = BigNumber.from(10).pow(18);
  return value
    .div(denom)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
