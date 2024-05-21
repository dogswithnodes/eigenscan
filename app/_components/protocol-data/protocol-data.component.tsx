'use client';
import { useCallback, useState } from 'react';
import BigNumber from 'bignumber.js';

import { StyledProtocolData, Contracts, ContractsModal } from './protocol-data.styled';
import { ProtocolContracts } from './components/protocol-contracts/protocol-contracts.component';

import { Spinner } from '../spinner/spinner.component';

import { BN_ZERO } from '@/app/_constants/big-number.constants';
import { useProtocolData } from '@/app/_services/protocol-data.service';
import { useStrategies } from '@/app/_services/strategies.service';
import { preventDefault } from '@/app/_utils/events.utils';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';
import noData from '@/app/_assets/images/no-data.svg';

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

  const totals = strategies.data.strategies.reduce<{
    totalDeposit: BigNumber;
    totalDelegated: BigNumber;
  }>(
    (acc, { totalDelegated, totalShares, ethBalance }) => {
      const bnTotalShares = new BigNumber(totalShares);
      const bnEthBalance = new BigNumber(ethBalance);

      acc.totalDeposit = acc.totalDeposit.plus(bnEthBalance);

      if (bnTotalShares.gt(0)) {
        acc.totalDelegated = acc.totalDelegated.plus(
          new BigNumber(totalDelegated).times(bnEthBalance).div(bnTotalShares),
        );
      }

      return acc;
    },
    {
      totalDeposit: BN_ZERO,
      totalDelegated: BN_ZERO,
    },
  );

  return (
    <>
      <StyledProtocolData role="table">
        <section className="protocol-data-row" role="row">
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">Total deposit</span>
            {renderBNWithOptionalTooltip(totals.totalDeposit)}
            &nbsp;
            <span className="protocol-data-units">ETH</span>
          </section>
          <section className="protocol-data-cell" role="cell">
            <span className="protocol-data-cell-title">Total delegated</span>
            {renderBNWithOptionalTooltip(totals.totalDelegated)}
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
