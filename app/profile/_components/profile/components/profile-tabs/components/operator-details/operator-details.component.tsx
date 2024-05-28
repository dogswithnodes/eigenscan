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
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { Footer } from '@/app/_components/footer/footer.component';
import { renderBNWithOptionalTooltip } from '@/app/_utils/render.utils';

export type Props = {
  delegatorsCount: number | undefined;
  tvl: string | undefined;
  website: string | undefined;
  twitter: string | undefined;
};

export const OperatorDetails: React.FC<Props> = ({ delegatorsCount = 0, tvl = '0', website, twitter }) => {
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
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>TVL</Th>
                  <Td>
                    {renderBNWithOptionalTooltip(tvl)}
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
