'use client';
import { OperatorActionsRow, transformToCsvRow } from './operator-actions.model';
import { useOperatorActions } from './operator-actions.service';
import { expandedRowRender } from './operator-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';

type Props = {
  id: string;
};

export const OperatorActions: React.FC<Props> = ({ id }) => {
  const { data, isPending, error } = useOperatorActions(id);

  return (
    <ActionsTable<OperatorActionsRow>
      id={id}
      tableName="operator-actions"
      data={data}
      error={error}
      isPending={isPending}
      expandedRowRender={expandedRowRender}
      transformToCsvRow={transformToCsvRow}
    />
  );
};
