import { Container, ChartContainer } from './avs-details.styled';

import { OperatorsQuorumWeights } from '../../avs-tabs.model';

import { Table, Tr, Th, Td, Postfix } from '@/app/_components/details/details.styled';
import { Footer } from '@/app/_components/footer/footer.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { preventDefault } from '@/app/_utils/events.utils';
import { formatNumber, formatOptionalTooltipNumber } from '@/app/_utils/number.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  registrationsCount: number;
  ethTvl: number;
  eigenTvl: number;
  website: string | undefined;
  twitter: string | undefined;
  weights: OperatorsQuorumWeights | null;
  blsApkRegistry: string | undefined;
  stakeRegistry: string | undefined;
  minimalStake: number | null;
};

export const AVSDetails: React.FC<Props> = ({
  website,
  twitter,
  registrationsCount,
  eigenTvl,
  ethTvl,
  minimalStake,
  blsApkRegistry,
  stakeRegistry,
}) => {
  return (
    <>
      <Container>
        <Table>
          <tbody>
            <Tr>
              <Th>Website</Th>
              <Td>
                {/* TODO render generic link */}
                {website ? (
                  <a onMouseDown={preventDefault} href={website} target="_blank" rel="noreferrer">
                    {website.replace(/(^\w+:|^)\/\//, '').replace(/\/+$/, '')}
                  </a>
                ) : (
                  'no data'
                )}
              </Td>
            </Tr>
            <Tr>
              <Th>Twitter</Th>
              <Td>
                {twitter ? (
                  <a onMouseDown={preventDefault} href={twitter} target="_blank" rel="noreferrer">
                    {twitter.replace(/(^\w+:|^)\/\//, '').replace(/\/+$/, '')}
                  </a>
                ) : (
                  'no data'
                )}
              </Td>
            </Tr>
            {blsApkRegistry && (
              <Tr>
                <Th>BlsApkRegistry</Th>
                <Td>
                  <span data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={blsApkRegistry}>
                    <a
                      onMouseDown={preventDefault}
                      href={`https://etherscan.io/address/${blsApkRegistry}`}
                      target="_blank"
                      rel="noreferrer"
                      className="monospaced"
                    >
                      {clampMiddle(blsApkRegistry)}
                    </a>
                  </span>
                </Td>
              </Tr>
            )}
            {stakeRegistry && (
              <Tr>
                <Th>StakeRegistry</Th>
                <Td>
                  <span data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={stakeRegistry}>
                    <a
                      onMouseDown={preventDefault}
                      href={`https://etherscan.io/address/${stakeRegistry}`}
                      target="_blank"
                      rel="noreferrer"
                      className="monospaced"
                    >
                      {clampMiddle(stakeRegistry)}
                    </a>
                  </span>
                </Td>
              </Tr>
            )}
            {minimalStake && (
              <Tr>
                <Th>Minimal stake</Th>
                <Td>
                  <span
                    data-tooltip-id={GLOBAL_TOOLTIP_ID}
                    data-tooltip-content={formatOptionalTooltipNumber(minimalStake)}
                  >
                    {formatNumber(minimalStake)}
                  </span>
                </Td>
              </Tr>
            )}
            <Tr>
              <Th>TVL ETH</Th>
              <Td>
                <span
                  data-tooltip-id={GLOBAL_TOOLTIP_ID}
                  data-tooltip-content={formatOptionalTooltipNumber(ethTvl)}
                >
                  {formatNumber(ethTvl)}
                </span>
                <Postfix> ETH</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>TVL EIGEN</Th>
              <Td>
                <span
                  data-tooltip-id={GLOBAL_TOOLTIP_ID}
                  data-tooltip-content={formatOptionalTooltipNumber(eigenTvl)}
                >
                  {formatNumber(eigenTvl)}
                </span>
                <Postfix> EIGEN</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>Operators count</Th>
              <Td>{registrationsCount}</Td>
            </Tr>
          </tbody>
        </Table>
        <ChartContainer></ChartContainer>
      </Container>
      <Footer />
    </>
  );
};
