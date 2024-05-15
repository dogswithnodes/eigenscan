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
import { AccountButtons } from '@/app/_components/account-buttons/account-buttons.component';
import { clampMiddle } from '@/app/_utils/text.utils';
import { renderDate, renderImage } from '@/app/_utils/render.utils';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';

export type Props = {
  id: string;
  name: string | undefined;
  created: string | undefined;
  logo: string | undefined;
};

export const AccountCard: React.FC<Props> = ({ id, name, created, logo }) => {
  return (
    <Container>
      <Left>
        <ImageBox>{renderImage(logo)}</ImageBox>
        {name && (
          <Name data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={name}>
            {name}
          </Name>
        )}
      </Left>
      <Right>
        <Title>
          <Heading>{clampMiddle(id)}</Heading>
          <AccountButtons id={id} />
          {created && <Created>{renderDate(created)}</Created>}
        </Title>
      </Right>
    </Container>
  );
};
