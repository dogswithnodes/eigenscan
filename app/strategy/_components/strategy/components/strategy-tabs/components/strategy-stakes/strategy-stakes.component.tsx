'use client';
import { useEffect, useMemo } from 'react';

import { StrategyStakesRow, columns, columnsWidth } from './strategy-stakes.model';
import { useStrategyStakes, useStrategyStakesCsv } from './strategy-stakes.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  balance: string;
  totalSharesAndWithdrawing: string;
  stakesCount: number;
};

export const StrategyStakes: React.FC<Props> = ({ id, balance, totalSharesAndWithdrawing, stakesCount }) => {
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
  } = useTable<StrategyStakesRow>({
    tableName: 'strategy-stakes',
    sortParams: {
      orderBy: 'shares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(stakesCount);
  }, [stakesCount, setTotal]);

  const {
    data: stakers,
    error,
    isFetching,
    isPending,
  } = useStrategyStakes(
    {
      id,
      currentPage,
      perPage,
      sortParams,
    },
    balance,
    totalSharesAndWithdrawing,
  );

  const { isCsvLoading, handleCsvDownload } = useStrategyStakesCsv(
    id,
    stakesCount,
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
    <Table<StrategyStakesRow>
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
        unsortableKeys: ['staker'],
      }}
    />
  );
};
