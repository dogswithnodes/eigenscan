'use client';
import { ColumnType } from 'antd/es/table';

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
};

const titles: Record<Exclude<keyof OperatorAVSsRow, 'key'>, string> = {
  logo: 'Img',
  avsId: 'AVS',
  avsName: 'AVS name',
  registered: 'Registered',
  totalWeight: 'Total weight',
  quorum: 'Quorum',
};

export const columnsWidth = {
  '2560': [65, 474, 474, 474, 474, 100],
  '1920': [56, 301, 377, 301, 301, 100],
  '1440': [51, 261, 342, 261, 261, 100],
  '1280': [48, 244, 302, 244, 244, 100],
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
];

export type AVSStatusIdToQuorum = Record<string, number | null>;

export const transformToRows = ({ quorums, avsStatuses }: OperatorAVSsEnriched): Array<OperatorAVSsRow> => {
  return avsStatuses.flatMap(({ id, avs, operator, logo, name }) => {
    const avsQuorums = quorums.filter(({ quorum }) => quorum.avs.id === avs.id);

    const baseRow = {
      key: id,
      logo,
      avsName: name,
      avsId: avs.id,
      registered: operator.registered,
    };

    if (avsQuorums.length === 0) {
      const row: OperatorAVSsRow = {
        ...baseRow,
        totalWeight: '0',
        quorum: null,
      };

      return row;
    }

    return avsQuorums.map(({ totalWeight, quorum }) => {
      return {
        ...baseRow,
        totalWeight,
        quorum: quorum.quorum,
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
