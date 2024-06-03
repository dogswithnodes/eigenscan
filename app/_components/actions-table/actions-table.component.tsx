'use client';
import { ExpandableConfig } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { columnsWidth, getColumns } from './actions-table.model';

import { ExpandButton } from '../expand-button/expand-button.component';
import { Table } from '../table/table.component';

import { Empty } from '@/app/_components/empty/empty.component';
import { TablePreloader } from '@/app/_components/table-preloader/table-preloader.component';
import { BaseActionsRow } from '@/app/_models/actions.model';
import { downloadTableData } from '@/app/_utils/table-data.utils';
import { useTable } from '@/app/_utils/table.utils';

export const actionsCache = new Map();

export const ActionsTable = <
  Row extends BaseActionsRow & {
    actionDataEntries: Array<[string, unknown]>;
  },
>({
  id,
  data,
  tableName,
  error,
  isPending,
  expandedRowRender,
  transformToCsvRow,
  ...rest
}: {
  id: string;
  data: Array<Row> | undefined;
  tableName: string;
  error: Error | null;
  isPending: boolean;
  expandedRowRender: NonNullable<ExpandableConfig<Row>['expandedRowRender']>;
  transformToCsvRow: (row: Row) => Record<string, unknown>;
}) => {
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
  } = useTable<Row>({
    tableName,
    id,
    sortParams: {
      orderBy: 'blockNumber',
      orderDirection: 'desc',
    },
  });

  const [rows, setRows] = useState<Array<Row>>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setTotal(data.length);
    }
  }, [data, setTotal]);

  const cacheKey = useMemo(
    () => JSON.stringify([id, perPage, currentPage, sortParams]),
    [currentPage, id, perPage, sortParams],
  );

  const workerRef = useRef<Worker>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('./actions-table.worker', import.meta.url));

      workerRef.current.onmessage = (event: MessageEvent<Array<Row>>) => {
        setIsLoading(false);
        setRows(event.data);
        actionsCache.set(cacheKey, event.data);
      };

      workerRef.current.onerror = (event) => {
        // eslint-disable-next-line no-console
        console.log(`Worker error event: ${event}`);
      };
    }
    return () => {
      workerRef.current?.terminate();
    };
  }, [cacheKey]);

  useEffect(() => {
    if (data) {
      const rows = actionsCache.get(cacheKey);

      if (Array.isArray(rows)) {
        setRows(rows);
      } else {
        setIsLoading(true);
        workerRef.current?.postMessage({ rows: data, perPage, currentPage, sortParams });
      }
    }
  }, [cacheKey, currentPage, data, id, perPage, sortParams]);

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data || [],
      sortParams,
      fileName: 'operator-actions',
      transformToCsvRow,
    });
  }, [data, sortParams, transformToCsvRow]);

  if (isPending || (rows.length === 0 && isLoading)) {
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
    <Table<Row>
      rows={rows}
      columns={getColumns()}
      columnsWidth={columnsWidth}
      isUpdating={rows.length > 0 && isLoading}
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
      expandable={{
        columnWidth: 44,
        expandRowByClick: true,
        rowExpandable(row) {
          return row.actionDataEntries.some(([, value]) => value !== null);
        },
        expandIcon({ expanded, onExpand, record, expandable }) {
          return expandable ? (
            <ExpandButton $isExpanded={expanded} onClick={(e) => onExpand(record, e)} />
          ) : null;
        },
        expandedRowRender,
      }}
      {...rest}
    />
  );
};
