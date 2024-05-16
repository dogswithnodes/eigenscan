'use client';
import { useEffect, useMemo } from 'react';

import { StakersRow, columns, columnsWidth } from './stakers.model';
import { useStakers, useStakersCsv, useStakersSearch } from './stakers.service';

import { HomeTabTableCommonProps } from '../../home-tabs.model';

import { Empty } from '@/app/_components/empty/empty.component';
import { Table } from '@/app/_components/table/table.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { useTable } from '@/app/_utils/table.utils';

export const Stakers: React.FC<HomeTabTableCommonProps> = ({ searchTerm }) => {
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
  } = useTable<StakersRow>({
    tableName: 'stakers',
    sortParams: {
      orderBy: 'totalShares',
      orderDirection: 'desc',
    },
  });

  const { data: protocolData } = useProtocolData();

  const {
    data: stakers,
    error,
    isFetching,
    isPending,
  } = useStakers({
    currentPage,
    perPage,
    sortParams,
    idFilters,
  });

  const { data: foundStakers, isFetching: isSearching } = useStakersSearch(searchTerm);

  const { isCsvLoading, handleCsvDownload } = useStakersCsv(sortParams);

  const rows = useMemo(() => stakers ?? [], [stakers]);

  useEffect(() => {
    if (foundStakers?.length) {
      if (String(idFilters) !== String(foundStakers)) {
        setIdFilters(foundStakers);
        setTotal(foundStakers.length);
        setCurrentPage(1);
      }
    } else if (protocolData && !isSearching) {
      setTotal(protocolData.stakersCount);
      if (idFilters) {
        setIdFilters(null);
      }
    }
  }, [foundStakers, idFilters, isSearching, protocolData, setCurrentPage, setIdFilters, setTotal]);

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
    <Table<StakersRow>
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
        unsortableKeys: ['delegatedTo', 'lastDelegatedAt', 'lastUndelegatedAt'],
      }}
    />
  );
};
