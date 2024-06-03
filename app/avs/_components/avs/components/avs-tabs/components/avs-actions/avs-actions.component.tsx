'use client';
import { AVSActionsRow, transformToCsvRow } from './avs-actions.model';
import { useAVSActions } from './avs-actions.service';
import { expandedRowRender } from './avs-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';

type Props = {
  id: string;
};

export const AVSActions: React.FC<Props> = ({ id }) => {
  const { data, isPending, error } = useAVSActions(id);

  return (
    <ActionsTable<AVSActionsRow>
      id={id}
      tableName="avs-actions"
      data={data}
      error={error}
      isPending={isPending}
      expandedRowRender={expandedRowRender}
      transformToCsvRow={transformToCsvRow}
    />
  );
};
