'use client';
import { useEffect, useMemo } from 'react';

import { AVSActionsRow } from './avs-actions.model';
import { useAVSActions, useAVSActionsCsv } from './avs-actions.service';
import { expandedRowRender } from './avs-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  avsId: string;
  actionsCount: number;
};

export const AVSActions: React.FC<Props> = ({ avsId, actionsCount }) => {
  const {
    currentPage,
    perPage,
    perPageOptions,
    sortParams,
    total,
    storageManager,
    setCurrentPage,
    setPerPage,
    setSortParams,
    setTotal,
  } = useTable<AVSActionsRow>({
    tableName: 'avs-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(actionsCount);
  }, [actionsCount, setTotal]);

  const { data, isPending, isFetching, error } = useAVSActions({
    avsId,
    currentPage,
    perPage,
    sortParams,
  });

  const rows = useMemo(() => data ?? [], [data]);

  const { isCsvLoading, handleCsvDownload } = useAVSActionsCsv({
    avsId,
    actionsCount,
    sortParams,
  });

  if (isPending) {
    return <TablePreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    storageManager.setStoragePerPage(null);
    storageManager.setStorageSortParams(null);
    return <Empty />;
  }

  return (
    <ActionsTable<AVSActionsRow>
      rows={rows}
      isUpdating={isFetching}
      expandedRowRender={expandedRowRender}
      paginationOptions={{
        currentPage,
        perPage,
        perPageOptions,
        total,
        setCurrentPage,
        setPerPage,
      }}
      sortingOptions={{
        sortParams,
        setSortParams,
      }}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
      }}
    />
  );
};
