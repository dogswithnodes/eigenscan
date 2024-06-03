'use client';
import { QuorumOperators } from './components/quorum-operators/quorum-operators.component';
import { Registrations } from './components/registrations/registrations.component';

import { StrategiesMap } from '@/app/_models/strategies.model';

type Props = {
  avsId: string;
  operatorsCount: number;
  quorum: number | null;
  quorumWeight: string | null;
  strategiesMap: StrategiesMap;
};

export const AVSOperators: React.FC<Props> = (props) => {
  const { avsId, quorum, quorumWeight, strategiesMap, operatorsCount } = props;

  return typeof quorum === 'number' && quorumWeight ? (
    <QuorumOperators
      avsId={avsId}
      quorum={quorum}
      quorumWeight={quorumWeight}
      strategiesMap={strategiesMap}
      operatorsCount={operatorsCount}
    />
  ) : (
    <Registrations {...props} />
  );
};
