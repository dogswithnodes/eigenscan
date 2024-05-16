import { AccountCard, Props as AccountCardProps } from './components/account-card/account-card.component';

import { Card, Cards } from '@/app/_components/cards/cards.styled';

export const StrategyCards: React.FC<AccountCardProps> = ({ id, name, logo }) => {
  return (
    <Cards>
      <Card>
        <AccountCard id={id} name={name} logo={logo} />
      </Card>
    </Cards>
  );
};
