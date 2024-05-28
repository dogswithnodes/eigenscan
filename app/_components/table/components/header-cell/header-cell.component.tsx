import { ColumnType } from 'antd/es/table';

import { SortParams } from '@/app/_models/sort.model';

type Props<Row> = {
  className: string;
  dataIndex: ColumnType<Row>['dataIndex'];
  sortParams?: SortParams<Row>;
  onClick: () => void;
};

export const HeaderCell = <Row extends Record<string, unknown>>({
  className,
  dataIndex,
  sortParams,
  onClick,
  ...restProps
}: Props<Row>) => {
  return (
    <th
      onClick={onClick}
      data-id={dataIndex}
      className={`${className}${
        dataIndex === sortParams?.orderBy
          ? sortParams?.orderDirection === 'asc'
            ? ' ant-table-cell_sorted ant-table-cell_sorted_asc'
            : ' ant-table-cell_sorted ant-table-cell_sorted_desc'
          : ''
      }`}
      {...restProps}
    />
  );
};
