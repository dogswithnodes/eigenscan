'use client';
import { ExpandableConfig } from 'antd/es/table/interface';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { columnsWidth, getColumns } from './actions-table.model';
import { useActionTypes } from './actions-table.utils';
import { FilterTitle } from './components/filter-title/filter-title.component';

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
  const actionTypesWorkerRef = useRef<Worker>();

  const { actionTypes, currentActions, setActionTypes, setCurrentActions } = useActionTypes();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      actionTypesWorkerRef.current = new Worker(new URL('./action-types.worker', import.meta.url));

      actionTypesWorkerRef.current.onmessage = (event: MessageEvent<Array<string>>) => {
        setActionTypes(event.data);
        actionTypesWorkerRef.current?.terminate();
      };
    }

    return () => {
      actionTypesWorkerRef.current?.terminate();
    };
  }, [setActionTypes]);

  useEffect(() => {
    if (data) {
      actionTypesWorkerRef.current?.postMessage(data);
    }
  }, [data]);

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

  const cacheKey = useMemo(
    () => JSON.stringify([tableName, id, perPage, currentPage, sortParams, currentActions.sort()]),
    [currentActions, currentPage, id, perPage, sortParams, tableName],
  );

  const paginationWorkerRef = useRef<Worker>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      paginationWorkerRef.current = new Worker(new URL('./pagination.worker', import.meta.url));

      paginationWorkerRef.current.onmessage = (
        event: MessageEvent<{
          rows: Array<Row>;
          total: number;
        }>,
      ) => {
        const { rows, total } = event.data;

        setIsLoading(false);
        setRows(rows);
        setTotal(total);
        actionsCache.set(cacheKey, {
          rows,
          total,
        });
      };

      paginationWorkerRef.current.onerror = (event) => {
        // eslint-disable-next-line no-console
        console.log(`Worker error event: ${event}`);
      };
    }

    return () => {
      paginationWorkerRef.current?.terminate();
    };
  }, [cacheKey, setTotal]);

  useEffect(() => {
    if (data) {
      const cached = actionsCache.get(cacheKey);

      if (cached) {
        setRows(cached.rows);
        setTotal(cached.total);
      } else {
        setIsLoading(true);
        paginationWorkerRef.current?.postMessage({
          rows: data,
          perPage,
          currentPage,
          sortParams,
          currentActions,
        });
      }
    }
  }, [cacheKey, currentActions, currentPage, data, id, perPage, setTotal, sortParams]);

  const handleCsvDownload = useCallback(() => {
    downloadTableData({
      data: data || [],
      sortParams,
      fileName: tableName,
      transformToCsvRow,
    });
  }, [data, sortParams, tableName, transformToCsvRow]);

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
      columns={getColumns((title: string) => (
        <FilterTitle
          actionTypes={actionTypes}
          currentActions={currentActions}
          title={title}
          setCurrentActions={setCurrentActions}
        />
      ))}
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
