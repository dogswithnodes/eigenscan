import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchAllOperatorActions, fetchOperatorActionsCsv } from './operator-actions.action';
import { OperatorActionsFetchParams, transformToCsvRow } from './operator-actions.model';

import { transformToCsv } from '@/app/_utils/actions.utils';
import { downloadCsv } from '@/app/_utils/csv.utils';

const createServerCacheKey = (id: string) => JSON.stringify(['operator-actions', id]);

export const useOperatorActions = (params: OperatorActionsFetchParams) => {
  const { id, currentPage, perPage, sortParams } = params;

  return useQuery({
    queryKey: ['operator-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const data = await fetchAllOperatorActions(createServerCacheKey(id), params);

      return data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useOperatorActionsCsv = ({
  id,
  sortParams,
}: Pick<OperatorActionsFetchParams, 'id' | 'sortParams'>) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['operator-actions-csv', id, sortParams],
    queryFn: async () => {
      const data = await fetchOperatorActionsCsv(createServerCacheKey(id));

      const csv = transformToCsv({ sortParams, transformer: transformToCsvRow })(data);

      return csv;
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadCsv(data ?? ((await refetch()).data || []), 'operator-actions');
  }, [data, refetch]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
