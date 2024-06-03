'use client';
import { useEffect, useMemo } from 'react';

import { StrategyDelegationsRow, columns, columnsWidth } from './strategy-delegations.model';
import { useStrategyDelegations, useStrategyDelegationsCsv } from './strategy-delegations.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  delegationsCount: number;
  balance: string;
  totalSharesAndWithdrawing: string;
};

export const StrategyDelegations: React.FC<Props> = ({
  id,
  delegationsCount,
  balance,
  totalSharesAndWithdrawing,
}) => {
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
  } = useTable<StrategyDelegationsRow>({
    tableName: 'strategy-stakes',
    id,
    sortParams: {
      orderBy: 'shares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(delegationsCount);
  }, [delegationsCount, setTotal]);

  const {
    data: stakers,
    error,
    isFetching,
    isPending,
  } = useStrategyDelegations(
    {
      id,
      currentPage,
      perPage,
      sortParams,
    },
    balance,
    totalSharesAndWithdrawing,
  );

  const { isCsvLoading, handleCsvDownload } = useStrategyDelegationsCsv(
    id,
    delegationsCount,
    sortParams,
    balance,
    totalSharesAndWithdrawing,
  );

  const rows = useMemo(() => stakers ?? [], [stakers]);

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
    <Table<StrategyDelegationsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
      }}
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
        unsortableKeys: ['operator'],
      }}
    />
  );
};
