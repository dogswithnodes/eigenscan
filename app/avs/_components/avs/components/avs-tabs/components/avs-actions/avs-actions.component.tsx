'use client';
import { useCallback, useMemo } from 'react';
import { compose, prop, tap, map } from 'ramda';

import { AVSActionsRow, columns, columnsWidth, transformToCsvRow, transformToRow } from './avs-actions.model';

import { AVSAction } from '../../../../avs.model';

import { Table } from '@/app/_components/table/table.component';
import { downloadCsv } from '@/app/_utils/csv.utils';
import { sortTableRows } from '@/app/_utils/sort.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  actions: Array<AVSAction>;
};

export const AVSActions: React.FC<Props> = ({ actions }) => {
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
  } = useTable<AVSActionsRow>({
    tableName: 'avs-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const rows = useMemo(
    () =>
      compose(
        (strategies: Array<AVSActionsRow>) =>
          strategies.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
        map(transformToRow),
      )(actions),
    [sortParams, setTotal, actions, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadCsv(
      compose(map(transformToCsvRow), sortTableRows(sortParams), map(transformToRow))(actions),
      'avs-actions',
    );
  }, [sortParams, actions]);

  return (
    <Table<AVSActionsRow>
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
