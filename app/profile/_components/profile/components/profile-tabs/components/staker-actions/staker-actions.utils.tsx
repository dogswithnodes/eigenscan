import { StakerActionsRow } from './staker-actions.model';

import ActionData from '@/app/_components/action-data/action-data.component';
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { renderAddressLink, renderBigNumber } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export const expandedRowRender = (row: StakerActionsRow) => {
  return (
    <ActionData.Container>
      {row.actionDataEntries.flatMap(([key, value]) => {
        if (value === null) return [];

        if (key === 'strategies') {
          return value.map(({ share, strategy: { tokenSymbol } }) => (
            <ActionData.Entry key={tokenSymbol} title={tokenSymbol} value={renderBigNumber(share)} />
          ));
        }

        let renderedValue;

        switch (key) {
          case 'delegatedTo':
            renderedValue = renderAddressLink('profile', 'operator-details')(value.id);
            break;
          case 'share':
            renderedValue = renderBigNumber(value);
            break;
          case 'strategy':
            renderedValue = renderAddressLink('strategy', 'strategy-details', value.name)(value.id);
            break;
          case 'eigonPod':
          case 'withdrawer':
            renderedValue = (
              <ExternalLink href={`https://etherscan.io/address/${value}`}>{clampMiddle(value)}</ExternalLink>
            );
            break;
          case 'queuedTransactionHash':
          case 'completedTransactionHash':
            renderedValue = (
              <ExternalLink href={`https://etherscan.io/tx/${value}`}>{clampMiddle(value)}</ExternalLink>
            );
            break;
          case 'queuedBlockNumber':
          case 'completedBlockNumber':
          case 'nonce':
          case 'startBlock':
          case 'token':
            renderedValue = value;
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
