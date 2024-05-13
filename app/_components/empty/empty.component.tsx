import { StyledEmpty } from './empty.styled';

import { Footer } from '../footer/footer.component';

import noData from '@/app/_assets/images/no-data.svg';

export const Empty: React.FC = () => {
  return (
    <>
      <StyledEmpty>
        <div className="empty-image-containter">
          <img src={noData.src} alt="" width={40} height={40} />
        </div>
        <p className="empty-description">No data found</p>
      </StyledEmpty>
      <Footer />
    </>
  );
};
