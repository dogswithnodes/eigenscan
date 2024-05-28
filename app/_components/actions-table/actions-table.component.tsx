'use client';
import { ExpandableConfig } from 'antd/es/table/interface';

import { columnsWidth, getColumns } from './actions-table.model';

import { ExpandButton } from '../expand-button/expand-button.component';
import { Table, Props as TableProps } from '../table/table.component';

import { BaseActionsRow } from '@/app/_models/actions.model';

export const ActionsTable = <
  Row extends BaseActionsRow & {
    actionDataEntries: Array<[string, unknown]>;
  },
>({
  expandedRowRender,
  ...rest
}: Omit<TableProps<Row>, 'columnsWidth' | 'expandable' | 'columns'> & {
  expandedRowRender: NonNullable<ExpandableConfig<Row>['expandedRowRender']>;
}) => {
  return (
    <Table<Row>
      columns={getColumns()}
      columnsWidth={columnsWidth}
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
