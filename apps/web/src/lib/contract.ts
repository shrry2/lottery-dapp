import { Contract } from '@ethersproject/contracts';
import { ChainId } from '@usedapp/core';
import { utils } from 'ethers';

import LotteryAbi from '~/abi/Lottery.json';
import MockTokenAbi from '~/abi/MockToken.json';
import { addresses } from '~/config';
import { Lottery } from '~typechain-types/Lottery';
import { MockToken } from '~typechain-types/MockToken';

/**
 * MockToken
 */

const mockTokenInterface = new utils.Interface(MockTokenAbi);
export const mockTokenContract = new Contract(
  addresses.mockToken[ChainId.Goerli],
  mockTokenInterface
) as MockToken;

/**
 * Lottery
 */

const lotteryInterface = new utils.Interface(LotteryAbi);
export const lotteryContract = new Contract(
  addresses.lottery[ChainId.Goerli],
  lotteryInterface
) as Lottery;
