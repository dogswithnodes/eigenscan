import { Table, Thead, Th, BodyRow, Td, TdContent } from './protocol-contracts.styled';

import { AccountButtons } from '@/app/_components/account-buttons/account-buttons.component';
import { ExternalLink } from '@/app/_components/external-link/external-link.component';
import { ProtocolContracts as Props } from '@/app/_models/protocol-data.model';
import { clampMiddle } from '@/app/_utils/text.utils';

export const ProtocolContracts: React.FC<Props> = ({
  delegationManager,
  strategyManager,
  eigenPodManager,
  avsDirectory,
  slasher,
}) => {
  const renderAddress = (address: string) => (
    <TdContent>
      <ExternalLink href={`https://etherscan.io/address/${address}`}>{clampMiddle(address)}</ExternalLink>
      <AccountButtons id={address} />
    </TdContent>
  );

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Contract</Th>
          <Th>Address</Th>
        </tr>
      </Thead>
      <tbody>
        <BodyRow>
          <Td>Delegation Manager</Td>
          <Td>{renderAddress(delegationManager)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Strategy Manager</Td>
          <Td>{renderAddress(strategyManager)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Eigen Pod Manager</Td>
          <Td>{renderAddress(eigenPodManager)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>AVS Directory</Td>
          <Td>{renderAddress(avsDirectory)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Slasher</Td>
          <Td>{renderAddress(slasher)}</Td>
        </BodyRow>
      </tbody>
    </Table>
  );
};
