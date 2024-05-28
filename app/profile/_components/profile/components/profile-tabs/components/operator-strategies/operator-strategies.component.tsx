'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { OperatorStrategiesRow, columns, columnsWidth, transformToCsvRow } from './operator-strategies.model';
import { useOperatorStrategies } from './operator-strategies.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { StrategyEnriched } from '@/app/_models/strategies.model';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  strategies: Array<StrategyEnriched>;
};

export const OperatorStrategies: React.FC<Props> = ({ id, strategies }) => {
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
  } = useTable<OperatorStrategiesRow>({
    tableName: 'operator-strategies',
    sortParams: {
      orderBy: 'totalDelegated',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useOperatorStrategies(id, strategies);

  const rows = useMemo(
    () =>
      compose(
        (strategies: Array<OperatorStrategiesRow>) =>
          strategies.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
      )(data || []),
    [sortParams, setTotal, data, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data || [],
      fileName: 'operator-strategies',
      sortParams,
      transformToCsvRow,
    });
  }, [data, sortParams]);

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
    <Table<OperatorStrategiesRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={false}
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
        isLoading: false,
      }}
    />
  );
};
