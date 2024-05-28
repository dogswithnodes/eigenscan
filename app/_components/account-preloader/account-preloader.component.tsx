import { PreloaderBackground } from '../background/background.styled';
import { CardsPreloader } from '../cards/cards-preloader/cards-preloader.component';
import { Footer } from '../footer/footer.component';
import { Spinner } from '../spinner/spinner.component';

export const AccountPreloader: React.FC = () => {
  return (
    <>
      <CardsPreloader />
      <PreloaderBackground>
        <Spinner />
      </PreloaderBackground>
      <Footer />
    </>
  );
};
