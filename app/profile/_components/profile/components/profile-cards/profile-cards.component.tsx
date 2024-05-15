import { AccountCard, Props as AccountCardProps } from './components/account-card/account-card.component';
import {
  DescriptionCard,
  Props as DescriptionCardProps,
} from './components/description-card/description-card.component';

import { Card, Cards } from '@/app/_components/cards/cards.styled';

export const ProfileCards: React.FC<AccountCardProps & DescriptionCardProps> = ({
  id,
  name,
  logo,
  created,
  description,
}) => {
  return (
    <Cards>
      <Card>
        <AccountCard id={id} name={name} logo={logo} created={created} />
      </Card>
      <Card>
        <DescriptionCard description={description} />
      </Card>
    </Cards>
  );
};
