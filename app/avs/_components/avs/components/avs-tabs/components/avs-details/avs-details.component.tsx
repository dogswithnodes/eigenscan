import { Container } from './avs-details.styled';
import { Charts, Props as ChartProps } from './components/charts.component';

import { Table, Tr, Th, Td, Postfix } from '@/app/_components/details/details.styled';
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { Footer } from '@/app/_components/footer/footer.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  operatorsCount: number;
  ethTvl: string;
  eigenTvl: string;
  website: string | undefined;
  twitter: string | undefined;
  blsApkRegistry: string | undefined;
  stakeRegistry: string | undefined;
  minimalStake: string | null;
} & ChartProps;

export const AVSDetails: React.FC<Props> = ({
  website,
  twitter,
  operatorsCount,
  eigenTvl,
  ethTvl,
  minimalStake,
  blsApkRegistry,
  stakeRegistry,
  operatorsWeights,
  strategiesWeights,
}) => {
  return (
    <>
      <Container>
        <Table>
          <tbody>
            <Tr>
              <Th>Website</Th>
              <Td>
                {website ? (
                  <ExternalLink href={website}>
                    {website.replace(/(^\w+:|^)\/\//, '').replace(/\/+$/, '')}
                  </ExternalLink>
                ) : (
                  'no data'
                )}
              </Td>
            </Tr>
            <Tr>
              <Th>Twitter</Th>
              <Td>
                {twitter ? (
                  <ExternalLink href={twitter}>
                    {twitter.replace(/(^\w+:|^)\/\//, '').replace(/\/+$/, '')}
                  </ExternalLink>
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
                    <ExternalLink
                      href={`https://etherscan.io/address/${blsApkRegistry}`}
                      className="monospaced"
                    >
                      {clampMiddle(blsApkRegistry)}
                    </ExternalLink>
                  </span>
                </Td>
              </Tr>
            )}
            {stakeRegistry && (
              <Tr>
                <Th>StakeRegistry</Th>
                <Td>
                  <span data-tooltip-id={GLOBAL_TOOLTIP_ID} data-tooltip-content={stakeRegistry}>
                    <ExternalLink
                      href={`https://etherscan.io/address/${stakeRegistry}`}
                      className="monospaced"
                    >
                      {clampMiddle(stakeRegistry)}
                    </ExternalLink>
                  </span>
                </Td>
              </Tr>
            )}
            {minimalStake && (
              <Tr>
                <Th>Minimal stake</Th>
                <Td>{renderBNWithOptionalTooltip(minimalStake)}</Td>
              </Tr>
            )}
            <Tr>
              <Th>TVL ETH</Th>
              <Td>
                {renderBNWithOptionalTooltip(ethTvl)}
                <Postfix> ETH</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>TVL EIGEN</Th>
              <Td>
                {renderBNWithOptionalTooltip(eigenTvl)}
                <Postfix> EIGEN</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>Operators count</Th>
              <Td>{operatorsCount}</Td>
            </Tr>
          </tbody>
        </Table>
        <Charts operatorsWeights={operatorsWeights} strategiesWeights={strategiesWeights} />
      </Container>
      <Footer />
    </>
  );
};
