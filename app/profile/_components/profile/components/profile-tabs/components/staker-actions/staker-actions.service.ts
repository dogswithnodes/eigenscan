import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchAllStakerActions, fetchStakerActionsCsv } from './staker-actions.action';
import { StakerActionsFetchParams, transformToCsvRow } from './staker-actions.model';

import { transformToCsv } from '@/app/_utils/actions.utils';
import { downloadCsv } from '@/app/_utils/csv.utils';

const createServerCacheKey = (id: string) => JSON.stringify(['staker-actions', id]);

export const useStakerActions = (params: StakerActionsFetchParams) => {
  const { id, currentPage, perPage, sortParams } = params;

  return useQuery({
    queryKey: ['staker-actions', id, currentPage, perPage, sortParams],
    queryFn: async () => {
      const data = await fetchAllStakerActions(createServerCacheKey(id), params);

      return data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useStakerActionsCsv = ({
  id,
  sortParams,
}: Pick<StakerActionsFetchParams, 'id' | 'sortParams'>) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['staker-actions-csv', id, sortParams],
    queryFn: async () => {
      const data = await fetchStakerActionsCsv(createServerCacheKey(id));

      const csv = transformToCsv({ sortParams, transformer: transformToCsvRow })(data);

      return csv;
    },
    enabled: false,
  });

  const handleCsvDownload = useCallback(async () => {
    downloadCsv(data ?? ((await refetch()).data || []), 'staker-actions');
  }, [data, refetch]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
