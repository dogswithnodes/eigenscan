'use client';
import { useEffect, useMemo } from 'react';

import { OperatorActionsRow } from './operator-actions.model';
import { useOperatorActions, useOperatorActionsCsv } from './operator-actions.service';
import { expandedRowRender } from './operator-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  actionsCount: number;
};

export const OperatorActions: React.FC<Props> = ({ id, actionsCount }) => {
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
  } = useTable<OperatorActionsRow>({
    tableName: 'operator-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(actionsCount);
  }, [actionsCount, setTotal]);

  const { data, isPending, isFetching, error } = useOperatorActions({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const rows = useMemo(() => data ?? [], [data]);

  const { isCsvLoading, handleCsvDownload } = useOperatorActionsCsv({
    id,
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
    <ActionsTable<OperatorActionsRow>
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
