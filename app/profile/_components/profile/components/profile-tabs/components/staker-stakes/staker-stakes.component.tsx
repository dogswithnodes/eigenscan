'use client';
import { useCallback, useMemo } from 'react';
import { compose, prop, tap, map } from 'ramda';

import {
  StakerStakesRow,
  columns,
  columnsWidth,
  transformToCsvRow,
  transformToRow,
} from './staker-stakes.model';

import { StakerStake } from '../../../../profile.model';

import { Table } from '@/app/_components/table/table.component';
import { StrategyEnriched, StrategyToEthBalance } from '@/app/_models/strategies.model';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  stakes: Array<StakerStake>;
  strategies: Array<StrategyEnriched>;
  strategyToEthBalance: StrategyToEthBalance;
};

export const StakerStakes: React.FC<Props> = ({ stakes, strategies, strategyToEthBalance }) => {
  const {
    currentPage,
    perPage,
    perPageOptions,
    sortParams,
    total,
    setCurrentPage,
    setPerPage,
    setSortParams,
    setTotal,
  } = useTable<StakerStakesRow>({
    tableName: 'staker-stakes',
    sortParams: {
      orderBy: 'lstBalance',
      orderDirection: 'desc',
    },
  });

  const rows = useMemo(
    () =>
      compose(
        (stakerStakes: Array<StakerStakesRow>) =>
          stakerStakes.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
        map(transformToRow(strategies, strategyToEthBalance)),
      )(stakes),
    [sortParams, setTotal, strategies, strategyToEthBalance, stakes, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadCsv(
      compose(
        map(transformToCsvRow),
        sortTableRows(sortParams),
        map(transformToRow(strategies, strategyToEthBalance)),
      )(stakes),
      'staker-stakes',
    );
  }, [sortParams, strategies, strategyToEthBalance, stakes]);

  return (
    <Table<StakerStakesRow>
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
