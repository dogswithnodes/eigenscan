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

export type Props = {
  delegatorsCount: number | undefined;
  tvl: number | undefined;
  website: string | undefined;
  twitter: string | undefined;
};

export const OperatorDetails: React.FC<Props> = ({ delegatorsCount = 0, tvl = 0, website, twitter }) => {
  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>Website</Th>
                  <Td>
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
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>TVL</Th>
                  <Td>
                    <span
                      data-tooltip-id={GLOBAL_TOOLTIP_ID}
                      data-tooltip-content={formatOptionalTooltipNumber(tvl)}
                    >
                      {formatNumber(tvl)}
                    </span>
                    <Postfix> ETH</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>Delegators count</Th>
                  <Td>{delegatorsCount}</Td>
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
