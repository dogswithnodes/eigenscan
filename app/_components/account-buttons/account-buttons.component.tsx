import { CopyToClipboard } from 'react-copy-to-clipboard';

import { StyledAccountButtons, AccountButton } from './account-buttons.styled';
import copy from './images/copy.svg';
import external from './images/external.svg';

import { ExternalLink } from '../external-link/external-link.component';

import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { preventDefault } from '@/app/_utils/events.utils';

type Props = {
  id: string;
  url?: string;
};

export const AccountButtons: React.FC<Props> = ({ id, url = 'https://etherscan.io/address' }) => {
  return (
    <StyledAccountButtons>
      <CopyToClipboard text={id}>
        <AccountButton
          data-tooltip-id={GLOBAL_TOOLTIP_ID}
          data-tooltip-content="Copy to clipboard"
          onMouseDown={preventDefault}
        >
          <img src={copy.src} alt="" width={12} height={13} />
        </AccountButton>
      </CopyToClipboard>
      <ExternalLink href={`${url}/${id}`} tabIndex={-1}>
        <AccountButton onMouseDown={preventDefault}>
          <img src={external.src} alt="" width={9} height={10} />
        </AccountButton>
      </ExternalLink>
    </StyledAccountButtons>
  );
};
