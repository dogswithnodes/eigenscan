import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ColorHash from 'color-hash';

import { Container, ChartContainer, ChartDot, TooltipContent } from './avs-details.styled';
import { useTopWeightOperatorsNames } from './avs-details.service';
import { transformWeightsToChartData } from './avs-details.utils';

import { QuorumWeights } from '../../avs-tabs.model';

import { Table, Tr, Th, Td, Postfix } from '@/app/_components/details/details.styled';
import { Footer } from '@/app/_components/footer/footer.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { preventDefault } from '@/app/_utils/events.utils';
import { clampMiddle } from '@/app/_utils/text.utils';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';
import { divBy1e18, mulDiv } from '@/app/_utils/big-number.utils';
// TODO single component
const RADIAN = Math.PI / 180;
const OTHERS_NAME = 'others';

export type Props = {
  operatorsCount: number;
  ethTvl: string;
  eigenTvl: string;
  website: string | undefined;
  twitter: string | undefined;
  operatorsWeights: QuorumWeights | null;
  strategiesWeights: QuorumWeights | null;
  blsApkRegistry: string | undefined;
  stakeRegistry: string | undefined;
  minimalStake: string | null;
};

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
  const [chart, setChart] = useState<'operators' | 'strategies' | null>(
    operatorsWeights ? 'operators' : null,
  );

  const totalWeight = divBy1e18(
    (chart === 'operators' ? operatorsWeights?.totalWeight : strategiesWeights?.totalWeight) ?? '0',
  );

  const chartSegments = chart === 'operators' ? 10 : Infinity;

  const colorHash = new ColorHash();

  const data = useMemo(() => {
    const fullData = transformWeightsToChartData(
      chart === 'operators' ? operatorsWeights : strategiesWeights,
    );

    return fullData
      ? [
          ...fullData.slice(0, chartSegments),
          fullData.slice(chartSegments).reduce<{ name: string; value: number }>(
            (acc, { value }) => {
              acc.value += value;
              return acc;
            },
            { name: OTHERS_NAME, value: 0 },
          ),
        ]
      : null;
  }, [chart, chartSegments, operatorsWeights, strategiesWeights]);

  const { data: operatorsNames } = useTopWeightOperatorsNames(
    chart === 'operators' ? data?.flatMap(({ name }) => (name === OTHERS_NAME ? [] : name)) : undefined,
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
              <Td>{operatorsCount}</Td>
            </Tr>
          </tbody>
        </Table>
        <ChartContainer>
          {data && (
            <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={400}>
              <PieChart width={600} height={600}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    const value = (percent * 100).toFixed(0);

                    return Number(value) < 4 ? null : (
                      <text
                        style={{
                          fontSize: 12,
                        }}
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {`${value}%`}
                      </text>
                    );
                  }}
                  dataKey="value"
                >
                  {data.map(({ name }, index) => {
                    return <Cell key={`cell-${index}`} fill={colorHash.hex(name).toUpperCase()} />;
                  })}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const { name, value } = payload[0];

                      if (typeof name === 'string' && typeof value === 'number') {
                        const tooltipName =
                          chart === 'operators' && operatorsNames && name !== OTHERS_NAME
                            ? operatorsNames[name]
                            : name;

                        return (
                          <TooltipContent>
                            <p>
                              <span
                                style={
                                  typeof name === 'string'
                                    ? {
                                        color: colorHash.hex(name).toUpperCase(),
                                      }
                                    : undefined
                                }
                              >
                                {tooltipName}
                              </span>
                              :{' '}
                              <span>
                                {`${value.toFixed(2)} (${mulDiv(value, 100, totalWeight).toFixed(1)})%`}
                              </span>
                            </p>
                          </TooltipContent>
                        );
                      }
                    }

                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {chart && (
            <>
              <h3 className="chart-title">Quorum by {chart}</h3>
              <div className="chart-dots">
                <ChartDot $active={chart === 'operators'} onClick={() => setChart('operators')} />
                <ChartDot $active={chart === 'strategies'} onClick={() => setChart('strategies')} />
              </div>
            </>
          )}
        </ChartContainer>
      </Container>
      <Footer />
    </>
  );
};
