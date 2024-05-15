import { styled } from 'styled-components';

import { DetailsContainer } from '@/app/_components/details/details.styled';

export const Container = styled(DetailsContainer)`
  grid-template-columns: 1.5fr 1fr;
`;

export const ChartContainer = styled.section`
  border: 2px solid #243855;
  border-top: none;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;
