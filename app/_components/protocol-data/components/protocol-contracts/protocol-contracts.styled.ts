import { styled } from 'styled-components';

import { Link } from '@/app/_components/link/link.styled';
import { mq } from '@/app/_utils/media-query.utils';

export const Table = styled.table`
  width: 100%;
  font-size: 20px;
  color: #859ec3;
  text-align: left;
  border-collapse: collapse;

  @media ${mq[1920]} {
    font-size: 18px;
  }

  @media ${mq[1440]} {
    font-size: 16px;
  }

  @media ${mq[1280]} {
    font-size: 14px;
  }
`;

export const Thead = styled.thead`
  background-color: #1f2d40;
`;

export const Th = styled.th`
  padding: 18px 40px;
  font-weight: 600;
`;

export const BodyRow = styled.tr`
  &:hover {
    background-color: #1e314b;
  }
`;

export const Td = styled.th`
  padding: 12px 40px;
  font-weight: 500;
`;

export const TdContent = styled.div`
  display: flex;
  align-items: center;
`;

export const Anchor = styled(Link)`
  margin-right: 16px;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  font-weight: 500;
  color: #387bca;
  text-decoration: none;
`;
