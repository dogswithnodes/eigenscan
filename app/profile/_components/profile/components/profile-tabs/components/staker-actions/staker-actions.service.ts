import { useQuery } from '@tanstack/react-query';

import { fetchAllStakerActions } from './staker-actions.actions';

export const useStakerActions = (id: string) => {
  return useQuery({
    queryKey: ['staker-actions', id],
    queryFn: async () => {
      const rows = await fetchAllStakerActions(id);

      return rows;
    },
  });
};
