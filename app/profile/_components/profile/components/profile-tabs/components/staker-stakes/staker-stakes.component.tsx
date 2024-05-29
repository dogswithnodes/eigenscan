'use client';
import { compose, prop, tap, map } from 'ramda';
import { useCallback, useMemo } from 'react';

import {
  StakerStakesRow,
  columns,
  columnsWidth,
  transformToCsvRow,
  transformToRow,
} from './staker-stakes.model';

import { StakerStake } from '../../../../profile.model';

import { Table } from '@/app/_components/table/table.component';
import { StrategiesMapEnriched } from '@/app/_models/strategies.model';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  stakes: Array<StakerStake>;
  strategiesMap: StrategiesMapEnriched;
};

export const StakerStakes: React.FC<Props> = ({ stakes, strategiesMap }) => {
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
        map(transformToRow(strategiesMap)),
      )(stakes),
    [sortParams, setTotal, strategiesMap, stakes, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: stakes.map(transformToRow(strategiesMap)),
      fileName: 'staker-stakes',
      sortParams,
      transformToCsvRow,
    });
  }, [sortParams, strategiesMap, stakes]);

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
