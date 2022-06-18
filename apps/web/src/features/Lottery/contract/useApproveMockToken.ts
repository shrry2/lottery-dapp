import { useContractFunction } from '@usedapp/core';

import { mockTokenContract } from '~/lib/contract';

export const useApproveMockToken = () => {
  return useContractFunction(mockTokenContract, 'approve');
};
