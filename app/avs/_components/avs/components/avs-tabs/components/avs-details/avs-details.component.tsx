import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ColorHash from 'color-hash';

import { Container, ChartContainer } from './avs-details.styled';

import { OperatorsQuorumWeights } from '../../avs-tabs.model';

import { Table, Tr, Th, Td, Postfix } from '@/app/_components/details/details.styled';
import { Footer } from '@/app/_components/footer/footer.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { preventDefault } from '@/app/_utils/events.utils';
import { divBy1e18 } from '@/app/_utils/big-number.utils';
import { clampMiddle } from '@/app/_utils/text.utils';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';

export type Props = {
  registrationsCount: number;
  ethTvl: string;
  eigenTvl: string;
  website: string | undefined;
  twitter: string | undefined;
  weights: OperatorsQuorumWeights | null;
  blsApkRegistry: string | undefined;
  stakeRegistry: string | undefined;
  minimalStake: string | null;
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
  weights,
}) => {
  const colorHash = new ColorHash();
  const data = useMemo(
    () =>
      weights
        ? Object.entries(weights)
            .flatMap(([id, weight]) =>
              id === 'totalWeight' ? [] : { name: id, value: Number(divBy1e18(weight).toFixed(2)) },
            )
            .sort((a, b) => b.value - a.value)
        : null,
    [weights],
  );

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
              <Td>{registrationsCount}</Td>
            </Tr>
          </tbody>
        </Table>
        <ChartContainer>
          {data && (
            <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={400}>
              <PieChart width={600} height={600}>
                <Pie
                  data={[
                    ...data.slice(0, 10),
                    data.slice(10).reduce<{ name: string; value: number }>(
                      (others, { value }) => {
                        others.value += value;
                        return others;
                      },
                      { name: 'others', value: 0 },
                    ),
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  dataKey="value"
                >
                  {data.map(({ name }, index) => {
                    return <Cell key={`cell-${index}`} fill={colorHash.hex(name).toUpperCase()} />;
                  })}
                </Pie>
                <Tooltip
                  itemStyle={{
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                  contentStyle={{
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </Container>
      <Footer />
    </>
  );
};
