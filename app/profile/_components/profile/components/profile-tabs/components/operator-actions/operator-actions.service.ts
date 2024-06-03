import { useQuery } from '@tanstack/react-query';

import { fetchAllOperatorActions } from './operator-actions.actions';

export const useOperatorActions = (id: string) => {
  return useQuery({
    queryKey: ['operator-actions', id],
    queryFn: async () => {
      const rows = await fetchAllOperatorActions(id);

      return rows;
    },
  });
};
