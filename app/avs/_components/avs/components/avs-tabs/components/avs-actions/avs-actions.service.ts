import { useQuery } from '@tanstack/react-query';

import { fetchAllAVSActions } from './avs-actions.actions';

export const useAVSActions = (id: string) => {
  return useQuery({
    queryKey: ['avs-actions', id],
    queryFn: async () => {
      const rows = await fetchAllAVSActions(id);

      return rows;
    },
  });
};
