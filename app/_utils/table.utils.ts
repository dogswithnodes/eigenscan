'use client';
import { useCallback, useEffect, useState } from 'react';

import { unixTimeToDateString } from './date.utils';

import { SortParams } from '../_models/sort.model';

export const formatTableDate = unixTimeToDateString('MMM dd, yyyy HH:mm');

export const useTable = <Row>({
  tableName,
  sortParams,
  id,
  perPageOptions,
}: {
  tableName: string;
  sortParams: SortParams<Row>;
  id?: string;
  perPageOptions?: Array<{ value: number; checked: boolean }>;
}) => {
  const [storageManager] = useState(() => new TableStorageManager<Row>(tableName, id));

  const [total, setTotal] = useState(0);
  const [_currentPage, _setCurrentPage] = useState(storageManager.getStorageCurrentPage() ?? 1);
  const [_sortParams, _setSortParams] = useState(storageManager.getStorageSortParams() ?? sortParams);
  const [_perPageOptions, _setPerPageOptions] = useState(
    perPageOptions ?? [
      { value: 15, checked: true },
      { value: 50, checked: false },
      { value: 100, checked: false },
    ],
  );
  const [idFilters, setIdFilters] = useState<Array<string> | null>(null);

  useEffect(() => {
    const perPage = storageManager.getStoragePerPage();
    if (perPage) {
      _setPerPageOptions((prev) =>
        prev.map((o) => ({
          ...o,
          checked: o.value === perPage,
        })),
      );
    }
  }, [storageManager]);

  const setCurrentPage = useCallback(
    (currentPage: number) => {
      _setCurrentPage(currentPage);
      storageManager.setStorageCurrentPage(currentPage);
    },
    [storageManager],
  );

  const setPerPage = useCallback(
    (perPage: number) => {
      setCurrentPage(1);
      _setPerPageOptions((prev) =>
        prev.map((o) => ({
          ...o,
          checked: o.value === perPage,
        })),
      );
      storageManager.setStoragePerPage(perPage);
    },
    [setCurrentPage, storageManager],
  );

  const setSortParams = useCallback(
    (orderBy: keyof Row) => {
      setCurrentPage(1);
      const { orderDirection } = _sortParams;
      const sortParams: SortParams<Row> = {
        orderBy,
        orderDirection: orderDirection === 'asc' ? 'desc' : 'asc',
      };
      _setSortParams(sortParams);
      storageManager.setStorageSortParams(sortParams);
    },
    [_sortParams, setCurrentPage, storageManager],
  );

  return {
    total,
    currentPage: _currentPage,
    sortParams: _sortParams,
    perPageOptions: _perPageOptions,
    perPage: _perPageOptions.reduce((acc, val) => (val.checked ? val.value : acc), 0),
    storageManager,
    idFilters,
    setTotal,
    setCurrentPage,
    setPerPage,
    setSortParams,
    setIdFilters,
  };
};

class TableStorageManager<Row> {
  private readonly perPageKey: string;
  private readonly sortKey: string;
  private readonly currentPageKey: string;
  private readonly id: string | undefined;

  constructor(tableName: string, id?: string) {
    this.id = id?.toLowerCase();
    this.perPageKey = `${tableName}-per-page`;
    this.currentPageKey = `${tableName}-current-page`;
    this.sortKey = `${tableName}-sort-params`;
  }

  getStoragePerPage = () => {
    const perPage =
      typeof localStorage !== 'undefined'
        ? Number(localStorage.getItem(`${this.perPageKey}${this.id ? `-${this.id}` : ''}`))
        : null;

    return perPage;
  };

  getStorageCurrentPage = () => {
    const currentPage =
      typeof localStorage !== 'undefined'
        ? Number(localStorage.getItem(`${this.currentPageKey}${this.id ? `-${this.id}` : ''}`))
        : NaN;

    return currentPage > 0 ? currentPage : null;
  };

  getStorageSortParams = (): SortParams<Row> | null => {
    const sortValue =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(`${this.sortKey}${this.id ? `-${this.id}` : ''}`)
        : null;
    try {
      return sortValue ? JSON.parse(sortValue) : null;
    } catch {
      return null;
    }
  };

  setStoragePerPage = (perPage: number | null) => {
    const key = `${this.perPageKey}${this.id ? `-${this.id}` : ''}`;
    if (perPage) {
      localStorage.setItem(key, String(perPage));
    } else {
      localStorage.removeItem(key);
    }
  };

  setStorageCurrentPage = (currentPage: number) => {
    localStorage.setItem(`${this.currentPageKey}${this.id ? `-${this.id}` : ''}`, String(currentPage));
  };

  setStorageSortParams = (sortParams: SortParams<Row> | null) => {
    const key = `${this.sortKey}${this.id ? `-${this.id}` : ''}`;
    if (sortParams) {
      localStorage.setItem(key, JSON.stringify(sortParams));
    } else {
      localStorage.removeItem(key);
    }
  };
}
