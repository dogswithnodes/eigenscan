import { AccountButtons } from '@/app/_components/account-buttons/account-buttons.component';
import {
  Container,
  Left,
  Right,
  Name,
  Title,
  Heading,
  ImageBox,
} from '@/app/_components/cards/left-card/left-card.styled';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { renderImage } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  id: string;
  name: string | undefined;
  logo: string | null | undefined;
};

export const AccountCard: React.FC<Props> = ({ id, name, logo }) => {
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
        </Title>
      </Right>
    </Container>
  );
};
