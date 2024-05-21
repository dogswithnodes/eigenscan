import {
  DetailsContainerWithPad,
  ContainerPad,
  TablePad,
  Table,
  Tr,
  Th,
  Td,
  Postfix,
} from '@/app/_components/details/details.styled';
import { Footer } from '@/app/_components/footer/footer.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';
import { preventDefault } from '@/app/_utils/events.utils';
import { formatNumber, formatOptionalTooltipNumber } from '@/app/_utils/number.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  whitelisted: boolean;
  balance: number;
  ethBalance: number;
  totalDelegated: number;
  totalWithdrawals: number;
  operatorsCount: number;
  stakesCount: number;
  delegationsCount: number;
  underlyingToken: string | null;
  tokenSymbol: string;
  tokenDecimals: number;
  totalDelegatedPercent: number;
};

export const StrategyDetails: React.FC<Props> = ({
  whitelisted,
  balance,
  ethBalance,
  totalDelegated,
  totalWithdrawals,
  operatorsCount,
  stakesCount,
  delegationsCount,
  underlyingToken,
  tokenSymbol,
  tokenDecimals,
  totalDelegatedPercent,
}) => {
  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>Whitelisted</Th>
                  <Td>{String(whitelisted)}</Td>
                </Tr>
                <Tr>
                  <Th>Balance</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(balance)}
                    >
                      {formatNumber(balance)}
                    </span>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Underlying Token</Th>
                  <Td>
                    {underlyingToken && (
                      <a
                        onMouseDown={preventDefault}
                        href={`https://etherscan.io/address/${underlyingToken}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {clampMiddle(underlyingToken)}
                      </a>
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Token Symbol</Th>
                  <Td>{tokenSymbol}</Td>
                </Tr>
                <Tr>
                  <Th>Token Decimals</Th>
                  <Td>{tokenDecimals}</Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>TVL ETH</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(ethBalance)}
                    >
                      {formatNumber(ethBalance)}
                    </span>
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Total withdrawals</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(totalWithdrawals)}
                    >
                      {formatNumber(totalWithdrawals)}
                    </span>
                    <Postfix> {tokenSymbol}</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Total delegated</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(totalDelegated)}
                    >
                      {formatNumber(totalDelegated)} ({totalDelegatedPercent.toFixed(1)}%)
                    </span>
                    <Postfix> {tokenSymbol}</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Stakes count</Th>
                  <Td>{stakesCount}</Td>
                </Tr>
                <Tr>
                  <Th>Operators count</Th>
                  <Td>{operatorsCount}</Td>
                </Tr>
                <Tr>
                  <Th>Delegations count</Th>
                  <Td>{delegationsCount}</Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
        </DetailsContainerWithPad>
      </ContainerPad>
      <Footer />
    </>
  );
};
