import { styled } from 'styled-components';

import { Link } from '../link/link.styled';
import { Modal } from '../modal/modal.component';

import { mq } from '@/app/_utils/media-query.utils';

export const StyledProtocolData = styled.article`
  margin: 16px 0 21px;
  background-color: #fff;
  border: 2px solid #ececec;
  border-radius: 8px;

  @media ${mq[1280]} {
    border-width: 1px;
  }

  .protocol-data-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .protocol-data-spinner-container {
    padding: 3px 0;
    display: flex;
    align-items: center;
    justify-content: center;

    @media ${mq[1920]} {
      padding: 2px 0;
    }

    @media ${mq[1440]} {
      padding: 1px 0;
    }

    @media ${mq[1280]} {
      padding: 0;
    }
  }

  .protocol-data-cell {
    position: relative;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-grow: 1;
    font-size: 22px;
    font-weight: bold;
    color: #000000;
    cursor: default;

    @media ${mq[1920]} {
      font-size: 20px;
    }

    @media ${mq[1440]} {
      font-size: 18px;
    }

    @media ${mq[1280]} {
      font-size: 16px;
    }

    &:after {
      position: absolute;
      content: '';
      width: 2px;
      height: 20px;
      top: 50%;
      right: 0;
      background-color: #cccccc;
      transform: translateY(-50%);
      transition: background-color 0.5s;

      @media ${mq[1920]} {
        height: 18px;
      }

      @media ${mq[1440]} {
        height: 16px;
      }

      @media ${mq[1280]} {
        width: 1px;
        height: 14px;
      }
    }

    &:last-of-type:after {
      display: none;
    }
  }

  .protocol-data-cell-title {
    margin-right: 14px;
    font-size: 18px;
    font-weight: 500;

    @media ${mq[1920]} {
      margin-right: 12px;
      font-size: 16px;
    }

    @media ${mq[1440]} {
      margin-right: 10px;
      font-size: 14px;
    }

    @media ${mq[1280]} {
      font-size: 12px;
    }
  }

  .protocol-data-units {
    font-size: 16px;
    font-weight: 500;
    color: #525252;

    @media ${mq[1920]} {
      font-size: 14px;
    }

    @media ${mq[1440]} {
      font-size: 12px;
    }

    @media ${mq[1280]} {
      font-size: 10px;
    }
  }
`;

export const Contracts = styled(Link)`
  font-size: 18px;
  font-weight: 500;

  @media ${mq[1920]} {
    font-size: 16px;
  }

  @media ${mq[1440]} {
    font-size: 14px;
  }

  @media ${mq[1280]} {
    font-size: 12px;
  }
`;

export const ContractsModal = styled(Modal)`
  .modal-content {
    padding: 0 !important;
  }
`;
