'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { AVSActionsRow, transformToCsvRow } from './avs-actions.model';
import { useAVSActions } from './avs-actions.service';
import { expandedRowRender } from './avs-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  avsId: string;
};

export const AVSActions: React.FC<Props> = ({ avsId }) => {
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
  } = useTable<AVSActionsRow>({
    tableName: 'avs-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useAVSActions(avsId);

  const rows = useMemo(
    () =>
      data
        ? compose(
            (rows: Array<AVSActionsRow>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortTableRows(sortParams),
            tap(compose(setTotal, prop('length'))),
          )(data)
        : [],
    [currentPage, data, perPage, setTotal, sortParams],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data || [],
      sortParams,
      fileName: 'avs-actions',
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
    <ActionsTable<AVSActionsRow>
      rows={rows}
      expandedRowRender={expandedRowRender}
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
      }}
    />
  );
};
