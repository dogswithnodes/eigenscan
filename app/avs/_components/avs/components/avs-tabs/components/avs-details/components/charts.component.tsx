'use client';
import ColorHash from 'color-hash';
import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { useTopWeightOperatorsNames } from './charts.service';
import { StyledCharts, ChartDot, TooltipContent } from './charts.styled';
import { transformWeightsToChartData } from './charts.utils';

import { QuorumWeights } from '../../../avs-tabs.model';

import { divBy1e18, mulDiv } from '@/app/_utils/big-number.utils';

const colorHash = new ColorHash();

const RADIAN = Math.PI / 180;
const OTHERS_NAME = 'others';

export type Props = {
  operatorsWeights: QuorumWeights | null;
  strategiesWeights: QuorumWeights | null;
};

export const Charts: React.FC<Props> = ({ operatorsWeights, strategiesWeights }) => {
  const [chart, setChart] = useState<'operators' | 'strategies' | null>(
    operatorsWeights ? 'operators' : null,
  );

  const totalWeight = divBy1e18(
    (chart === 'operators' ? operatorsWeights?.totalWeight : strategiesWeights?.totalWeight) ?? '0',
  );

  const chartSegments = chart === 'operators' ? 10 : Infinity;

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
    <StyledCharts>
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
          <h3 className="charts-title">Quorum by {chart}</h3>
          <div className="charts-dots">
            <ChartDot $active={chart === 'operators'} onClick={() => setChart('operators')} />
            <ChartDot $active={chart === 'strategies'} onClick={() => setChart('strategies')} />
          </div>
        </>
      )}
    </StyledCharts>
  );
};
