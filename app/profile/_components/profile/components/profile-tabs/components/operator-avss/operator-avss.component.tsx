'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { OperatorAVSsRow, columnsWidth, columns, transformToCsvRow } from './operator-avss.model';
import { useOperatorAVSs } from './operator-avss.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { StrategiesMapEnriched, StrategyEnriched } from '@/app/_models/strategies.model';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  strategies: Array<StrategyEnriched>;
  strategiesMap: StrategiesMapEnriched;
};

export const OperatorAVSs: React.FC<Props> = ({ id, strategies, strategiesMap }) => {
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
  } = useTable<OperatorAVSsRow>({
    tableName: 'operator-avss',
    sortParams: {
      orderBy: 'totalWeight',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useOperatorAVSs(id, strategies, strategiesMap);

  const rows = useMemo(
    () =>
      data
        ? compose(
            (avss: Array<OperatorAVSsRow>) => avss.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortTableRows(sortParams),
            tap(compose(setTotal, prop('length'))),
          )(data)
        : [],
    [data, sortParams, setTotal, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data || [],
      fileName: 'operator-avss',
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
    <Table<OperatorAVSsRow>
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
