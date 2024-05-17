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
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { useTable } from '@/app/_utils/table.utils';
import { Strategy } from '@/app/_models/strategies.model';
import { StrategyToTvlMap } from '@/app/_utils/strategies.utils';

type Props = {
  stakes: Array<StakerStake>;
  strategies: Array<Strategy>;
  strategyToTvl: StrategyToTvlMap;
};

export const StakerStakes: React.FC<Props> = ({ stakes, strategies, strategyToTvl }) => {
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
        (strategies: Array<StakerStakesRow>) =>
          strategies.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
        map(transformToRow(strategies, strategyToTvl)),
      )(stakes),
    [sortParams, setTotal, strategies, strategyToTvl, stakes, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadCsv(
      compose(
        map(transformToCsvRow),
        sortTableRows(sortParams),
        map(transformToRow(strategies, strategyToTvl)),
      )(stakes),
      'staker-stakes',
    );
  }, [sortParams, strategies, strategyToTvl, stakes]);

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
