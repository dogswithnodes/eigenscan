'use client';
import { useEffect, useMemo } from 'react';

import { RegistrationsRow, columns, columnsWidth } from './registrations.model';
import { useRegistrations, useRegistrationsCsv } from './registrations.service';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { StrategiesMap } from '@/app/_models/strategies.model';
import { useTable } from '@/app/_utils/table.utils';

type Props = {
  id: string;
  operatorsCount: number;
  strategiesMap: StrategiesMap;
};

export const Registrations: React.FC<Props> = ({ id, strategiesMap, operatorsCount }) => {
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
  } = useTable<RegistrationsRow>({
    tableName: 'registrations',
    sortParams: {
      orderBy: 'operator__totalShares',
      orderDirection: 'desc',
    },
  });

  useEffect(() => {
    setTotal(operatorsCount);
  }, [operatorsCount, setTotal]);

  const { data, isPending, isFetching, error } = useRegistrations(
    {
      id,
      currentPage,
      perPage,
      sortParams,
    },
    strategiesMap,
  );

  const rows = useMemo(() => data ?? [], [data]);

  const { isCsvLoading, handleCsvDownload } = useRegistrationsCsv(
    id,
    operatorsCount,
    sortParams,
    strategiesMap,
  );

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
    <Table<RegistrationsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
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
        unsortableKeys: ['logo', 'name'],
      }}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
      }}
    />
  );
};
