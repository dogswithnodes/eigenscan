'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { compose, prop, tap, map } from 'ramda';

import { AvsOperatorsRow, columns, columnsWidth, transformToCsvRow } from './avs-operators.model';
import { useAVSOperators } from './avs-operators.service';

import { OperatorsQuorumWeights } from '../../avs-tabs.model';
import { AVSOperator } from '../../../../avs.model';

import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { Table } from '@/app/_components/table/table.component';
import { StrategyToEthBalance } from '@/app/_models/strategies.model';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  operators: Array<AVSOperator>;
  weights: OperatorsQuorumWeights | null;
  strategyToEthBalance: StrategyToEthBalance;
};

export const AVSOperators: React.FC<Props> = ({ operators, weights, strategyToEthBalance }) => {
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
  } = useTable<AvsOperatorsRow>({
    tableName: 'avs-operators',
    sortParams: {
      orderBy: 'tvl',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useAVSOperators(operators, weights, strategyToEthBalance);

  const rows = useMemo(
    () =>
      data
        ? compose(
            (operators: Array<AvsOperatorsRow>) =>
              operators.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortTableRows(sortParams),
            tap(compose(setTotal, prop('length'))),
          )(data)
        : [],
    [data, sortParams, setTotal, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadCsv(compose(map(transformToCsvRow), sortTableRows(sortParams))(data ?? []), 'avs-operators');
  }, [sortParams, data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage, weights]);

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
    <Table<AvsOperatorsRow>
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
