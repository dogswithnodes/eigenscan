'use client';
import { useCallback, useState } from 'react';

import { StyledProtocolData, Contracts, ContractsModal } from './protocol-data.styled';
import { ProtocolContracts } from './components/protocol-contracts/protocol-contracts.component';

import { Spinner } from '../spinner/spinner.component';

import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { useStrategies } from '@/app/_services/strategies.service';
import { preventDefault } from '@/app/_utils/events.utils';
import { formatNumber, formatOptionalTooltipNumber } from '@/app/_utils/number.utils';
import noData from '@/app/_assets/images/no-data.svg';

const bigIntZero = BigInt(0);
const bigInt1e18 = BigInt(1e18);

export const ProtocolData: React.FC = () => {
  const [showContracts, setShowContracts] = useState(false);

  const protocolData = useProtocolData();
  const strategies = useStrategies();

  const toggleContracts = useCallback(() => {
    setShowContracts((prev) => !prev);
  }, []);

  if (protocolData.isPending || strategies.isPending) {
    return (
      <StyledProtocolData>
        <section className="protocol-data-spinner-container">
          <Spinner />
        </section>
      </StyledProtocolData>
    );
  }

  const error = protocolData.error || strategies.error;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return (
      <StyledProtocolData>
        <section className="protocol-data-spinner-container">
          <img src={noData.src} alt="" width={40} height={40} />
        </section>
      </StyledProtocolData>
    );
  }

  if (!protocolData.data || !strategies.data) {
    return null;
  }

  const {
    operatorsCount,
    avsCount,
    delegationManager,
    strategyManager,
    eigenPodManager,
    avsDirectory,
    slasher,
  } = protocolData.data;

  const protocolContracts = { delegationManager, strategyManager, eigenPodManager, avsDirectory, slasher };

  const { totalDeposit, totalDelegated } = strategies.data.reduce<{
    totalDeposit: bigint;
    totalDelegated: bigint;
  }>(
    (acc, { totalDelegated, totalShares, tvl }) => {
      const bigIntTotalShares = BigInt(totalShares);
      const bigIntTvl = BigInt(tvl);

      acc.totalDeposit += bigIntTvl;

      if (bigIntTotalShares > bigIntZero) {
        acc.totalDelegated += (BigInt(totalDelegated) * bigIntTvl) / bigIntTotalShares;
      }

      return acc;
    },
    {
      totalDeposit: bigIntZero,
      totalDelegated: bigIntZero,
    },
  );

  return (
    <>
      <StyledProtocolData role="table">
        <section className="protocol-data-row" role="row">
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">Total deposit</span>
            <span
              data-tooltip-id={GLOBAL_TOOLTIP_ID}
              data-tooltip-content={formatOptionalTooltipNumber(Number(totalDeposit / bigInt1e18))}
            >
              {formatNumber(String(totalDeposit / bigInt1e18))}
            </span>
            &nbsp;
            <span className="protocol-data-units">ETH</span>
          </section>
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">Total delegated</span>
            <span
              data-tooltip-id={GLOBAL_TOOLTIP_ID}
              data-tooltip-content={formatOptionalTooltipNumber(Number(totalDelegated / bigInt1e18))}
            >
              {formatNumber(String(totalDelegated / bigInt1e18))}
            </span>
            &nbsp;
            <span className="protocol-data-units">ETH</span>
          </section>
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">Operators</span>
            <span>{operatorsCount}</span>
          </section>
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">AVSs</span>
            <span>{avsCount}</span>
          </section>
          <section className="protocol-data-cell" role="cell">
            <Contracts as="button" onClick={toggleContracts} onMouseDown={preventDefault}>
              Protocol Contracts
            </Contracts>
          </section>
        </section>
      </StyledProtocolData>
      <ContractsModal title="Protocol contracts" isVisible={showContracts} onCancel={toggleContracts}>
        <ProtocolContracts {...protocolContracts} />
      </ContractsModal>
    </>
  );
};

export const ProtocolDataPreloader: React.FC = () => {
  return (
    <StyledProtocolData>
      <section className="protocol-data-spinner-container">
        <Spinner />
      </section>
    </StyledProtocolData>
  );
};
