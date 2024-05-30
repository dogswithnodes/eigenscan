'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { StakerActionsRow, transformToCsvRow } from './staker-actions.model';
import { useStakerActions } from './staker-actions.service';
import { expandedRowRender } from './staker-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';
import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
};

export const StakerActions: React.FC<Props> = ({ id }) => {
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
  } = useTable<StakerActionsRow>({
    tableName: 'staker-actions',
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const { data, isPending, error } = useStakerActions(id);

  const rows = useMemo(
    () =>
      data
        ? compose(
            (rows: Array<StakerActionsRow>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
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
      fileName: 'staker-actions',
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
    <ActionsTable<StakerActionsRow>
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
