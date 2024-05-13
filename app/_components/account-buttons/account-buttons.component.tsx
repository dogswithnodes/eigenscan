import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Copy, ExternalLink } from './account-buttons.icons';
import { StyledAccountButtons } from './account-buttons.styled';

import { AccountButton } from '../account-button/account-button.styled';

import { preventDefault } from '@/app/_utils/events.utils';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';

type Props = {
  id: string;
};

export const AccountButtons: React.FC<Props> = ({ id }) => {
  return (
    <StyledAccountButtons>
      <CopyToClipboard text={id}>
        <AccountButton
          data-tooltip-id={GLOBAL_TOOLTIP_ID}
          data-tooltip-content="Copy to clipboard"
          onMouseDown={preventDefault}
        >
          <Copy />
        </AccountButton>
      </CopyToClipboard>
      <a href={`TODO`} target="_blank" rel="noreferrer" style={{ outline: 'none' }} tabIndex={-1}>
        <AccountButton onMouseDown={preventDefault}>
          <ExternalLink />
        </AccountButton>
      </a>
    </StyledAccountButtons>
  );
};
