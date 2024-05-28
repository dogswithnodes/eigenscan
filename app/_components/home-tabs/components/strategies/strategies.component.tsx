'use client';
import { compose, prop, tap, map } from 'ramda';
import { useCallback, useMemo } from 'react';

import { StrategiesRow, columns, columnsWidth, transformToCsvRow, transformToRow } from './strategies.model';

import { HomeTabTableCommonProps } from '../../home-tabs.model';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useEnrichedStrategies } from '@/app/_services/strategies.service';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

export const Strategies: React.FC<HomeTabTableCommonProps> = ({ searchTerm }) => {
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
  } = useTable<StrategiesRow>({
    tableName: 'strategies',
    sortParams: {
      orderBy: 'ethBalance',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useEnrichedStrategies();

  const rows = useMemo(
    () =>
      compose(
        (strategies: Array<StrategiesRow>) =>
          strategies.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
        (strategies: Array<StrategiesRow>) => {
          const currentLength = strategies.length;
          const filtered = strategies.filter(
            (strategy) =>
              strategy.id.match(RegExp(searchTerm, 'i')) || strategy.name.match(RegExp(searchTerm, 'i')),
          );

          if (currentPage !== 1 && currentLength !== filtered.length) {
            setCurrentPage(1);
          }

          return filtered;
        },
        map(transformToRow),
      )(data?.strategies || []),
    [sortParams, setTotal, data, perPage, currentPage, searchTerm, setCurrentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data?.strategies.map(transformToRow) || [],
      fileName: 'strategies',
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
    <Table<StrategiesRow>
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
