import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchAllAVSActions, fetchAVSActionsCsv } from './avs-actions.action';
import { AVSActionsFetchParams, transformToCsvRow } from './avs-actions.model';

import { transformToCsv } from '@/app/_utils/actions.utils';
import { downloadCsv } from '@/app/_utils/csv.utils';

const createServerCacheKey = (id: string) => JSON.stringify(['avs-actions', id]);

export const useAVSActions = (params: AVSActionsFetchParams) => {
  const { id, currentPage, perPage, sortParams } = params;

  return useQuery({
    queryKey: ['avs-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const data = await fetchAllAVSActions(createServerCacheKey(id), params);

      return data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useAVSActionsCsv = ({ id, sortParams }: Pick<AVSActionsFetchParams, 'id' | 'sortParams'>) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['avs-actions-csv', id, sortParams],
    queryFn: async () => {
      const data = await fetchAVSActionsCsv(createServerCacheKey(id));

      const csv = transformToCsv({ sortParams, transformer: transformToCsvRow })(data);

      return csv;
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadCsv(data ?? ((await refetch()).data || []), 'avs-actions');
  }, [data, refetch]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
