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
import { formatNumber, formatOptionalTooltipNumber } from '@/app/_utils/number.utils';

export type Props = {
  operator: string | undefined;
  stakedEth?: number;
  stakedEigen?: number;
  totalWithdrawalsEth?: number;
  withdrawalsCount: number | undefined;
  stakesCount: number | undefined;
};

export const StakerDetails: React.FC<Props> = ({
  stakedEth = 0,
  stakedEigen = 0,
  operator,
  totalWithdrawalsEth = 0,
  withdrawalsCount = 0,
  stakesCount = 0,
}) => {
  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>Staked ETH</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(stakedEth)}
                    >
                      {formatNumber(stakedEth)}
                    </span>
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Staked Eigen</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(stakedEigen)}
                    >
                      {formatNumber(stakedEigen)}
                    </span>
                    <Postfix> EIGEN</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Total withdrawals ETH</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(totalWithdrawalsEth)}
                    >
                      {formatNumber(totalWithdrawalsEth)}
                    </span>
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>Operator</Th>
                  <Td>{operator}</Td>
                </Tr>
                <Tr>
                  <Th>Stakes count</Th>
                  <Td>{stakesCount}</Td>
                </Tr>
                <Tr>
                  <Th>Withdrawals count</Th>
                  <Td>{withdrawalsCount}</Td>
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
