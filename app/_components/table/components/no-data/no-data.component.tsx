import { styled } from 'styled-components';

import noData from '@/app/_assets/images/no-data.svg';

const StyledNoData = styled.section`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .no-data-description {
    margin-top: 20px;
  }
`;

export const NoData: React.FC = () => {
  return (
    <StyledNoData>
      <img src={noData.src} alt="No data" width="40" height="40" />
      <p className="no-data-description">No data found</p>
    </StyledNoData>
  );
};
