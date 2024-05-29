'use client';
import { useEffect, useMemo } from 'react';

import { StrategyOperatorsRow, columns, columnsWidth } from './strategy-operators.model';
import { useStrategyOperators, useStrategyOperatorsCsv } from './strategy-operators.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  balance: string;
  totalSharesAndWithdrawing: string;
  operatorsCount: number;
};

export const StrategyOperators: React.FC<Props> = ({
  id,
  balance,
  totalSharesAndWithdrawing,
  operatorsCount,
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
  } = useTable<StrategyOperatorsRow>({
    tableName: 'strategy-operators',
    sortParams: {
      orderBy: 'totalShares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(operatorsCount);
  }, [operatorsCount, setTotal]);

  const {
    data: stakers,
    error,
    isFetching,
    isPending,
  } = useStrategyOperators(
    {
      id,
      currentPage,
      perPage,
      sortParams,
    },
    balance,
    totalSharesAndWithdrawing,
  );

  const { isCsvLoading, handleCsvDownload } = useStrategyOperatorsCsv(
    id,
    operatorsCount,
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
    <Table<StrategyOperatorsRow>
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
        unsortableKeys: ['id', 'logo', 'name'],
      }}
    />
  );
};
