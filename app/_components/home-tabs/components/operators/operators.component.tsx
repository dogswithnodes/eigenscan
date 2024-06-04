'use client';
import { useEffect, useMemo } from 'react';

import { OperatorsRow, columns, columnsWidth } from './operators.model';
import { useOperators, useOperatorsCsv, useOperatorsSearch } from './operators.service';

import { SearchTableProps } from '../../home-tabs.model';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { useTable } from '@/app/_utils/table.utils';

export const Operators: React.FC<SearchTableProps> = ({ searchTerm }) => {
  const {
    currentPage,
    perPage,
    perPageOptions,
    sortParams,
    total,
    storageManager,
    idFilters,
    setCurrentPage,
    setPerPage,
    setSortParams,
    setTotal,
    setIdFilters,
  } = useTable<OperatorsRow>({
    tableName: 'operators',
    sortParams: {
      orderBy: 'delegatorsCount',
      orderDirection: 'desc',
    },
  });

  const { data: protocolData } = useProtocolData();

  const {
    data: operators,
    error,
    isFetching,
    isPending,
  } = useOperators({
    currentPage,
    perPage,
    sortParams,
    idFilters,
  });

  const { data: foundOperators, isFetching: isSearching } = useOperatorsSearch(searchTerm);

  const { isCsvLoading, handleCsvDownload } = useOperatorsCsv(sortParams);

  const rows = useMemo(() => operators ?? [], [operators]);

  useEffect(() => {
    if (foundOperators?.length) {
      if (String(idFilters) !== String(foundOperators)) {
        setIdFilters(foundOperators);
        setTotal(foundOperators.length);
        setCurrentPage(1);
      }
    } else if (protocolData && !isSearching) {
      setTotal(protocolData.operatorsCount);
      if (idFilters) {
        setIdFilters(null);
      }
    }
  }, [foundOperators, idFilters, isSearching, protocolData, setCurrentPage, setIdFilters, setTotal]);

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
    <Table<OperatorsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching || isSearching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
      }}
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
        unsortableKeys: ['logo', 'name', 'avsLogos'],
      }}
    />
  );
};
