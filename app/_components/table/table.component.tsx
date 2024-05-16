'use client';
import { useMemo, useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import ResizeObserver from 'rc-resize-observer';
import { Table as TableComponent } from 'antd';
import { ColumnType } from 'antd/es/table';

import { DownloadButtonProps, PaginationProps } from './table.model';
import { StyledTable, LoadScreen } from './table.styled';
import { HeaderCell } from './components/header-cell/header-cell.component';
import { NoData } from './components/no-data/no-data.component';
import { TableFooter } from './components/table-footer/table-footer.component';
import sort from './images/sort.svg';

import { Spinner } from '../spinner/spinner.component';

import { SortParams } from '@/app/_models/sort.model';

type Resolution = '2560' | '1920' | '1440' | '1280';

type Props<Row> = {
  columns: Array<ColumnType<Row>>;
  rows: Array<Row>;
  paginationOptions: PaginationProps;
  downloadCsvOptions: DownloadButtonProps;
  sortingOptions: {
    sortParams: SortParams<Row>;
    unsortableKeys?: Array<keyof Row>;
    setSortParams: (orderBy: keyof Row) => void;
  };
  columnsWidth: Record<Resolution, Array<number>>;
  isUpdating?: boolean;
};

export const Table = <Row extends Record<string, unknown>>({
  columns: _columns,
  rows,
  sortingOptions: { sortParams, unsortableKeys, setSortParams },
  columnsWidth,
  isUpdating,
  paginationOptions,
  downloadCsvOptions,
}: Props<Row>) => {
  const [resolution, setResolution] = useState<Resolution>('1920');
  const is1920 = useMediaQuery({ maxWidth: 1920 });
  const is1440 = useMediaQuery({ maxWidth: 1440 });
  const is1280 = useMediaQuery({ maxWidth: 1280 });
  useLayoutEffect(() => {
    if (is1280) {
      setResolution('1280');
    } else if (is1440) {
      setResolution('1440');
    } else if (is1920) {
      setResolution('1920');
    } else {
      setResolution('2560');
    }
  }, [is1280, is1440, is1920]);

  const [sticky, setSticky] = useState(true);
  useLayoutEffect(() => () => setSticky(false), []);

  const ref = useRef<HTMLDivElement>(null);
  const [spinnerTop, setSpinnerTop] = useState(0);
  const handleLoadScreenVisibleHeightChange = useCallback(() => {
    const loadScreen = ref.current;
    if (loadScreen) {
      requestAnimationFrame(() => {
        const loadScreenHeight = loadScreen.offsetHeight;
        const windowHeight = window.innerHeight;
        const coords = loadScreen.getBoundingClientRect();
        const loadScreenTop = coords.top;
        const loadScreenBottom = coords.bottom;
        setSpinnerTop(
          Math.max(
            0,
            loadScreenTop > 0
              ? Math.min(loadScreenHeight, windowHeight - loadScreenTop)
              : Math.min(loadScreenBottom, windowHeight),
          ) /
            2 -
            (loadScreenTop < 0 ? loadScreenTop : 0),
        );
      });
    }
  }, []);

  useEffect(() => {
    if (isUpdating) {
      window.addEventListener('scroll', handleLoadScreenVisibleHeightChange);
    } else {
      window.removeEventListener('scroll', handleLoadScreenVisibleHeightChange);
    }

    return () => window.removeEventListener('scroll', handleLoadScreenVisibleHeightChange);
  }, [handleLoadScreenVisibleHeightChange, isUpdating]);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  useEffect(() => {
    if (rows.length === 0) {
      paginationOptions.setCurrentPage(1);
    }
  }, [paginationOptions, rows.length]);

  const handleHeaderCellClick = useCallback(
    (orderBy: keyof Row) => () => {
      if (!unsortableKeys?.some((key) => key === orderBy)) {
        setSortParams(orderBy);
      }
    },
    [setSortParams, unsortableKeys],
  );

  const columns = useMemo(
    () =>
      _columns.map((column, id) => ({
        ...column,
        className: column.dataIndex === sortParams.orderBy ? 'ant-table-column_sorted ' : '',
        width: columnsWidth[resolution][id],
        fixed: id === 0 ? column.fixed ?? 'left' : column.fixed,
        title: (
          <>
            <div className="ant-table-column-title-container">
              <p className="ant-table-column-title">{column.title?.toString()}</p>
            </div>
            <span className="ant-table-sort-icon">
              <img src={sort.src} alt="Sort" width="14" height="10" />
            </span>
          </>
        ),
        onHeaderCell: ({ dataIndex }: ColumnType<Row>) => ({
          dataIndex,
          sortParams,
          onClick: handleHeaderCellClick(String(dataIndex)),
        }),
        onCell: (row: Row, rowIndex?: number) => {
          if (column.onCell) {
            const cellProps = column.onCell(row, rowIndex);
            const cellClassName = cellProps.className ?? '';
            return {
              ...cellProps,
              className:
                rowIndex === hoveredRowIndex
                  ? `ant-table-cell_row-hovered${cellClassName.length > 0 ? ' ' : ''}${cellClassName}`
                  : cellClassName,
            };
          }

          return {
            className: rowIndex === hoveredRowIndex ? 'ant-table-cell_row-hovered' : '',
          };
        },
      })),
    [_columns, sortParams, columnsWidth, resolution, handleHeaderCellClick, hoveredRowIndex],
  );

  return (
    <>
      <StyledTable>
        {isUpdating && (
          <ResizeObserver onResize={handleLoadScreenVisibleHeightChange}>
            <LoadScreen ref={ref} $spinnerTop={spinnerTop}>
              <div className="load-screen-spinner-container">
                <Spinner />
              </div>
            </LoadScreen>
          </ResizeObserver>
        )}
        <TableComponent<Row>
          tableLayout="fixed"
          dataSource={rows}
          columns={columns}
          locale={{
            emptyText: <NoData />,
          }}
          pagination={false}
          sticky={sticky}
          components={{
            header: {
              cell: HeaderCell,
            },
          }}
          onRow={(_, rowIndex) => ({
            onMouseEnter() {
              typeof rowIndex === 'number' && setHoveredRowIndex(rowIndex);
            },
            onMouseLeave() {
              setHoveredRowIndex(null);
            },
          })}
        />
      </StyledTable>
      <TableFooter
        hasData={rows.length > 0}
        downloadCsvOptions={downloadCsvOptions}
        paginationOptions={paginationOptions}
      />
    </>
  );
};
