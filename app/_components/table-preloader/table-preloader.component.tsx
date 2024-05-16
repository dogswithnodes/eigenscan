'use client';
import { styled } from 'styled-components';

import { PreloaderBackground } from '../background/background.styled';
import { Footer } from '../footer/footer.component';
import { Spinner } from '../spinner/spinner.component';

const Preloader = styled(PreloaderBackground)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

type Props = {
  withFooter?: boolean;
};

export const TablePreloader: React.FC<Props> = ({ withFooter = true }) => {
  return (
    <>
      <Preloader>
        <Spinner />
      </Preloader>
      {withFooter && <Footer />}
    </>
  );
};
