import { Spinner } from '../../spinner/spinner.component';
import { Cards, CardPreloader } from '../cards.styled';

export const CardsPreloader: React.FC = () => {
  return (
    <Cards>
      <CardPreloader>
        <Spinner />
      </CardPreloader>
      <CardPreloader>
        <Spinner />
      </CardPreloader>
    </Cards>
  );
};
