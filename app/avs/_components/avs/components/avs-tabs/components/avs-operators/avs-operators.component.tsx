'use client';
import { QuorumOperators } from './components/quorum-operators/quorum-operators.component';
import { Registrations } from './components/registrations/registrations.component';

import { StrategyToEthBalance } from '@/app/_models/strategies.model';

type Props = {
  avsId: string;
  operatorsCount: number;
  quorum: number | null;
  quorumWeight: string | null;
  strategyToEthBalance: StrategyToEthBalance;
};

export const AVSOperators: React.FC<Props> = (props) => {
  const { avsId, quorum, quorumWeight, strategyToEthBalance, operatorsCount } = props;

  return typeof quorum === 'number' && quorumWeight ? (
    <QuorumOperators
      avsId={avsId}
      quorum={quorum}
      quorumWeight={quorumWeight}
      strategyToEthBalance={strategyToEthBalance}
      operatorsCount={operatorsCount}
    />
  ) : (
    <Registrations {...props} />
  );
};
