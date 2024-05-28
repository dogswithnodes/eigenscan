'use client';
import { compose, prop, tap } from 'ramda';
import { useCallback, useMemo } from 'react';

import { AVSsRow, columns, columnsWidth, transformToCsvRow } from './avss.model';
import { useAVSs } from './avss.service';

import { HomeTabTableCommonProps } from '../../home-tabs.model';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { downloadTableData, sortTableRows } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

export const AVSs: React.FC<HomeTabTableCommonProps> = ({ searchTerm }) => {
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
  } = useTable<AVSsRow>({
    tableName: 'avss',
    sortParams: {
      orderBy: 'ethTvl',
      orderDirection: 'desc',
    },
  });

  const { data: avss, isPending, error } = useAVSs();

  const rows = useMemo(
    () =>
      avss
        ? compose(
            (avss: Array<AVSsRow>) => avss.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortTableRows(sortParams),
            tap(compose(setTotal, prop('length'))),
            (avss: Array<AVSsRow>) => {
              const currentLength = avss.length;
              const filtered = avss.filter(
                (avs) => avs.id.match(RegExp(searchTerm, 'i')) || avs.name.match(RegExp(searchTerm, 'i')),
              );

              if (currentPage !== 1 && currentLength !== filtered.length) {
                setCurrentPage(1);
              }

              return filtered;
            },
          )(avss)
        : [],
    [avss, currentPage, perPage, searchTerm, setCurrentPage, setTotal, sortParams],
  );

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: avss || [],
      sortParams,
      fileName: 'avss',
      transformToCsvRow,
    });
  }, [avss, sortParams]);

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
    <Table<AVSsRow>
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
