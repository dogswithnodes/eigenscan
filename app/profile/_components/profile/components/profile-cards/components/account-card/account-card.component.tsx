import { HashImageContainer } from './account-card.styled';

import { AccountButtons } from '@/app/_components/account-buttons/account-buttons.component';
import {
  Container,
  Left,
  Right,
  Name,
  Title,
  Heading,
  Created,
  ImageBox,
} from '@/app/_components/cards/left-card/left-card.styled';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { renderDate, renderImage } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  id: string;
  name: string | undefined;
  created: string | undefined;
  logo: string | undefined;
  url?: string;
};

export const AccountCard: React.FC<Props> = ({ id, name, created, logo, url }) => {
  return (
    <Container>
      <Left>
        {logo ? (
          <ImageBox>{renderImage(logo)}</ImageBox>
        ) : (
          <HashImageContainer size={120}>
            <img src={`https://robohash.org/${id}`} alt="" width={120} height={120} />
          </HashImageContainer>
        )}
        {name && (
          <Name data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={name}>
            {name}
          </Name>
        )}
      </Left>
      <Right>
        <Title>
          <Heading>{clampMiddle(id)}</Heading>
          <AccountButtons id={id} url={url} />
          {created && <Created>{renderDate(created)}</Created>}
        </Title>
      </Right>
    </Container>
  );
};
