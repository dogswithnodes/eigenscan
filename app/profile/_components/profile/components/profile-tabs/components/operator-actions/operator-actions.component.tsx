'use client';
import { compose, prop, tap, map } from 'ramda';
import { useCallback, useMemo } from 'react';

import {
  OperatorActionsRow,
  columns,
  columnsWidth,
  transformToCsvRow,
  transformToRow,
} from './operator-actions.model';

import { OperatorAction } from '../../../../profile.model';

import { Table } from '@/app/_components/table/table.component';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  actions: Array<OperatorAction>;
};

export const OperatorActions: React.FC<Props> = ({ actions }) => {
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
  } = useTable<OperatorActionsRow>({
    tableName: 'operator-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const rows = useMemo(
    () =>
      compose(
        (strategies: Array<OperatorActionsRow>) =>
          strategies.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortTableRows(sortParams),
        tap(compose(setTotal, prop('length'))),
        map(transformToRow),
      )(actions),
    [sortParams, setTotal, actions, perPage, currentPage],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: actions.map(transformToRow),
      fileName: 'operator-actions',
      sortParams,
      transformToCsvRow,
    });
  }, [sortParams, actions]);

  return (
    <Table<OperatorActionsRow>
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
