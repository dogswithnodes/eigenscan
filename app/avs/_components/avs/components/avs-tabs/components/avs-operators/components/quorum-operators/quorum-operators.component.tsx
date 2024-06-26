'use client';
import { useEffect, useMemo } from 'react';

import { QuorumOperatorsRow, columns, columnsWidth } from './quorum-operators.model';
import { useQuorumOperators, useQuorumOperatorsCsv } from './quorum-operators.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  operatorsCount: number;
  quorum: number;
  quorumWeight: string;
  strategiesMap: StrategiesMap;
};

export const QuorumOperators: React.FC<Props> = ({
  id,
  quorum,
  quorumWeight,
  strategiesMap,
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
  } = useTable<QuorumOperatorsRow>({
    tableName: 'quorum-operators',
    sortParams: {
      orderBy: 'operator__totalShares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(operatorsCount);
  }, [operatorsCount, setTotal]);

  useEffect(() => {
    setCurrentPage(1);
  }, [quorum, setCurrentPage]);

  const { data, isPending, isFetching, error } = useQuorumOperators(
    {
      id,
      quorum,
      currentPage,
      perPage,
      sortParams,
    },
    strategiesMap,
    quorumWeight,
  );

  const rows = useMemo(() => data ?? [], [data]);

  const { isCsvLoading, handleCsvDownload } = useQuorumOperatorsCsv(
    id,
    operatorsCount,
    quorum,
    quorumWeight,
    sortParams,
    strategiesMap,
  );

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
    <Table<QuorumOperatorsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
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
        unsortableKeys: ['logo', 'name'],
      }}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
      }}
    />
  );
};
