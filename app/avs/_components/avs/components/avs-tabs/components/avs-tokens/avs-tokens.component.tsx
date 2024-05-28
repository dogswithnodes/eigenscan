'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { AVSTokensRow, columns, columnsWidth, transformToCsvRow, transformToRows } from './avs-tokens.model';

import { Multiplier } from '../../../../avs.model';

import { Table } from '@/app/_components/table/table.component';
import { StrategyEnriched } from '@/app/_models/strategies.model';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  multipliers: Array<Multiplier>;
  strategies: Array<StrategyEnriched>;
};

export const AVSTokens: React.FC<Props> = ({ multipliers, strategies }) => {
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
  } = useTable<AVSTokensRow>({
    tableName: 'avs-tokens',
    sortParams: {
      orderBy: 'strategy',
      orderDirection: 'desc',
    },
  });

  const rows = useMemo(
    () =>
      compose(
        (tokens: Array<AVSTokensRow>) => tokens.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
      )(transformToRows(strategies, multipliers)),
    [sortParams, setTotal, strategies, multipliers, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: transformToRows(strategies, multipliers),
      fileName: 'avs-tokens',
      sortParams,
      transformToCsvRow,
    });
  }, [sortParams, strategies, multipliers]);

  return (
    <Table<AVSTokensRow>
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
