'use client';
import { useEffect, useMemo } from 'react';

import { OperatorStakersRow, columns, columnsWidth } from './operator-stakers.model';
import { useOperatorStakers, useOperatorStakersCsv } from './operator-stakers.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useTable } from '@/app/_utils/table.utils';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

type Props = {
  id: string;
  delegatorsCount: number | undefined;
  strategyToTvl: StrategyToTvlMap;
};

export const OperatorStakers: React.FC<Props> = ({ id, delegatorsCount = 0, strategyToTvl }) => {
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
  } = useTable<OperatorStakersRow>({
    tableName: 'operator-stakers',
    sortParams: {
      orderBy: 'totalShares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    if (typeof delegatorsCount === 'number') {
      setTotal(delegatorsCount);
    }
  }, [delegatorsCount, setTotal]);

  const {
    data: stakers,
    error,
    isFetching,
    isPending,
  } = useOperatorStakers(
    {
      id,
      currentPage,
      perPage,
      sortParams,
    },
    strategyToTvl,
  );

  const { isCsvLoading, handleCsvDownload } = useOperatorStakersCsv(
    id,
    delegatorsCount,
    sortParams,
    strategyToTvl,
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
    <Table<OperatorStakersRow>
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
        unsortableKeys: ['stakedEigen'],
      }}
    />
  );
};
