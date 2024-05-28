import { OperatorActionsRow } from './operator-actions.model';

import ActionData from '@/app/_components/action-data/action-data.component';
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { renderAddressLink } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export const expandedRowRender = (row: OperatorActionsRow) => {
  return (
    <ActionData.Container>
      {row.actionDataEntries.flatMap(([key, value]) => {
        if (value === null || (key === 'quorum' && value.quorum === null)) return [];

        let renderedValue;

        switch (key) {
          case 'avs':
            renderedValue = renderAddressLink('avs', 'avs-details')(value.id);
            break;
          case 'delegationApprover':
          case 'earningsReceiver':
            renderedValue = (
              <ExternalLink href={`https://etherscan.io/address/${value}`}>{clampMiddle(value)}</ExternalLink>
            );
            break;
          case 'delegator':
            renderedValue = renderAddressLink('profile', 'staker-details')(value.id);
            break;
          case 'metadataURI':
            renderedValue = <ExternalLink href={value}>{key}</ExternalLink>;
            break;
          case 'stakerOptOutWindowBlocks':
          case 'status':
            renderedValue = value;
            break;
          case 'quorum':
            renderedValue = value.quorum?.quorum;
            break;
          default: {
            const exhaustiveCheck: never = key;
            return exhaustiveCheck;
          }
        }

        return <ActionData.Entry key={key} title={key} value={renderedValue} />;
      })}
    </ActionData.Container>
  );
};
