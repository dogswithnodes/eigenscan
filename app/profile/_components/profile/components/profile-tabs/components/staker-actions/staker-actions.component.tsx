'use client';
import { useEffect } from 'react';

import { StakerActionsRow } from './staker-actions.model';
import { useStakerActions, useStakerActionsCsv } from './staker-actions.service';
import { expandedRowRender } from './staker-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
};

export const StakerActions: React.FC<Props> = ({ id }) => {
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
  } = useTable<StakerActionsRow>({
    tableName: 'staker-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, isFetching, error } = useStakerActions({ id, currentPage, perPage, sortParams });

  useEffect(() => {
    if (data) {
      setTotal(data.total);
    }
  }, [data, setTotal]);

  const { isCsvLoading, handleCsvDownload } = useStakerActionsCsv({ id, sortParams });

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
    <ActionsTable<StakerActionsRow>
      rows={data.rows}
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
