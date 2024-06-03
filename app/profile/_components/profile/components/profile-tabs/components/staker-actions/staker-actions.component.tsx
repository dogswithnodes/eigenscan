'use client';
import { StakerActionsRow, transformToCsvRow } from './staker-actions.model';
import { useStakerActions } from './staker-actions.service';
import { expandedRowRender } from './staker-actions.utils';

import { ActionsTable } from '@/app/_components/actions-table/actions-table.component';

type Props = {
  id: string;
};

export const StakerActions: React.FC<Props> = ({ id }) => {
  const { data, isPending, error } = useStakerActions(id);

  return (
    <ActionsTable<StakerActionsRow>
      id={id}
      tableName="staker-actions"
      data={data}
      error={error}
      isPending={isPending}
      expandedRowRender={expandedRowRender}
      transformToCsvRow={transformToCsvRow}
    />
  );
};
