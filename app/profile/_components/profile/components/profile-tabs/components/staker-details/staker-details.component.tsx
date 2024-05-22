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
import { renderAddressLink, renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';

export type Props = {
  operator: string | undefined;
  stakedEth: string | undefined;
  withdrawnEth: string | undefined;
  stakedEigen: string | undefined;
  withdrawnEigen: string | undefined;
  withdrawalsCount: number | undefined;
  stakesCount: number | undefined;
};

export const StakerDetails: React.FC<Props> = ({
  stakedEth = '0',
  stakedEigen = '0',
  withdrawnEth = '0',
  withdrawnEigen = '0',
  operator,
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
                    {renderBNWithOptionalTooltip(stakedEth)}
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Withdrawn ETH</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(withdrawnEth)}
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Staked Eigen</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(stakedEigen)}
                    <Postfix> EIGEN</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Withdrawn Eigen</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(withdrawnEigen)}
                    <Postfix> EIGEN</Postfix>
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
                  <Td>{renderAddressLink('profile', 'operator-details')(operator ?? null)}</Td>
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
