'use client';
import { ColumnType } from 'antd/es/table';

import { renderTokens } from './operator-avss.utils';

import { EIGEN_STRATEGY } from '@/app/_constants/addresses.constants';
import { StrategyEnriched } from '@/app/_models/strategies.model';
import { renderAddressLink, renderBigNumber, renderDate, renderImage } from '@/app/_utils/render.utils';

type OperatorAVSStatus = {
  id: string;
  avs: {
    id: string;
    metadataURI: string | null;
  };
  operator: {
    registered: string;
  };
};

type OperatorAVSStatusEnriched = OperatorAVSStatus & {
  logo: string;
  name: string;
};

export type OperatorAVSs = {
  quorums: Array<{
    totalWeight: string;
    quorum: {
      quorum: number;
      multipliers: Array<{
        strategy: {
          id: string;
        };
      }>;
      avs: {
        id: string;
      };
    };
  }>;
  avsStatuses: Array<OperatorAVSStatus>;
};

export type OperatorAVSsEnriched = Omit<OperatorAVSs, 'avsStatuses'> & {
  avsStatuses: Array<OperatorAVSStatusEnriched>;
};

export type OperatorAVSsRow = {
  key: string;
  logo: string;
  avsId: string;
  avsName: string;
  registered: string;
  totalWeight: string;
  quorum: number | null;
  tokens: Array<string>;
};

const titles: Record<Exclude<keyof OperatorAVSsRow, 'key'>, string> = {
  logo: 'Img',
  avsId: 'AVS',
  avsName: 'AVS name',
  registered: 'Registered',
  totalWeight: 'Total weight',
  quorum: 'Quorum',
  tokens: 'Allowed tokens',
};

export const columnsWidth = {
  '2560': [65, 433, 433, 433, 433, 100, 164],
  '1920': [56, 247, 377, 247, 247, 100, 162],
  '1440': [51, 209, 342, 209, 209, 100, 156],
  '1280': [48, 194, 302, 194, 194, 100, 150],
};

export const columns: Array<ColumnType<OperatorAVSsRow>> = [
  {
    title: titles.logo,
    dataIndex: 'logo',
    key: 'logo',
    render: renderImage,
  },
  {
    title: titles.avsId,
    dataIndex: 'avsId',
    key: 'avsId',
    align: 'center',
    render: renderAddressLink('avs', 'avs-details'),
  },
  {
    title: titles.avsName,
    dataIndex: 'avsName',
    key: 'avsName',
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
  },
  {
    title: titles.registered,
    dataIndex: 'registered',
    key: 'registered',
    align: 'center',
    render: renderDate,
  },
  {
    title: titles.totalWeight,
    dataIndex: 'totalWeight',
    key: 'totalWeight',
    render: renderBigNumber,
  },
  {
    title: titles.quorum,
    dataIndex: 'quorum',
    key: 'quorum',
    align: 'center',
  },
  {
    title: titles.tokens,
    dataIndex: 'tokens',
    key: 'tokens',
    align: 'center',
    render: renderTokens,
  },
];

export type AVSStatusIdToQuorum = Record<string, number | null>;

export const transformToRows = (
  { quorums, avsStatuses }: OperatorAVSsEnriched,
  strategies: Array<StrategyEnriched>,
): Array<OperatorAVSsRow> => {
  return avsStatuses.flatMap(({ id, avs, operator, logo, name }) => {
    const avsQuorums = quorums.filter(({ quorum }) => quorum.avs.id === avs.id);

    const baseRow = {
      logo,
      avsName: name,
      avsId: avs.id,
      registered: operator.registered,
    };

    if (avsQuorums.length === 0) {
      const row: OperatorAVSsRow = {
        ...baseRow,
        key: id,
        totalWeight: '0',
        quorum: null,
        tokens: strategies.flatMap(({ id, tokenSymbol }) => (id !== EIGEN_STRATEGY ? tokenSymbol : [])),
      };

      return row;
    }

    const idToStrategy = strategies.reduce<Record<string, StrategyEnriched>>((acc, strategy) => {
      acc[strategy.id] = strategy;
      return acc;
    }, {});

    return avsQuorums.map(({ totalWeight, quorum }) => {
      return {
        ...baseRow,
        key: `${id}+${quorum.quorum}`,
        totalWeight,
        quorum: quorum.quorum,
        tokens: quorum.multipliers.map(({ strategy }) => idToStrategy[strategy.id].tokenSymbol),
      };
    });
  });
};

export const transformToCsvRow = ({ logo, avsId, avsName, registered, totalWeight }: OperatorAVSsRow) => ({
  [titles.logo]: logo,
  [titles.avsId]: avsId,
  [titles.avsName]: avsName,
  [titles.registered]: registered,
  [titles.totalWeight]: totalWeight,
});
