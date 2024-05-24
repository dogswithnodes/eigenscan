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
import { preventDefault } from '@/app/_utils/events.utils';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';
import { clampMiddle } from '@/app/_utils/text.utils';

export type Props = {
  whitelisted: boolean;
  balance: string;
  ethBalance: string;
  totalDelegated: string;
  totalDelegatedPercent: string;
  totalWithdrawals: string;
  operatorsCount: number;
  stakesCount: number;
  delegationsCount: number;
  underlyingToken: string | null;
  tokenSymbol: string;
  tokenDecimals: number;
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
                  <Td>{renderBNWithOptionalTooltip(balance)}</Td>
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
                    {renderBNWithOptionalTooltip(ethBalance)}
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Total withdrawals</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(totalWithdrawals)}
                    <Postfix> {tokenSymbol}</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Total delegated</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(totalDelegated)} ({totalDelegatedPercent}%)
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
