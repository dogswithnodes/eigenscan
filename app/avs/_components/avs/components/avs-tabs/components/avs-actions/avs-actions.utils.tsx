import { AVSActionsRow } from './avs-actions.model';

import ActionData from '@/app/_components/action-data/action-data.component';
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { renderAddressLink, renderBigNumber } from '@/app/_utils/render.utils';

export const expandedRowRender = (row: AVSActionsRow) => {
  return (
    <ActionData.Container>
      {row.actionDataEntries.flatMap(([key, value]) => {
        if (value === null) return [];

        let renderedValue;

        switch (key) {
          case 'metadataURI':
            renderedValue = <ExternalLink href={value}>{key}</ExternalLink>;
            break;
          case 'minimumStake':
          case 'minimalStake':
            renderedValue = renderBigNumber(value);
            break;
          case 'multiplier':
            renderedValue = renderBigNumber(value.multiply);
            break;
          case 'quorumNumber':
            renderedValue = value;
            break;
          case 'operator':
            renderedValue = renderAddressLink('profile', 'operator-details')(value.id);
            break;
          case 'strategy':
            renderedValue = renderAddressLink('strategy', 'strategy-details', value.name)(value.id);
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
