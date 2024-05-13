import { Table, Thead, Th, BodyRow, Td, TdContent, Anchor } from './protocol-contracts.styled';

import { AccountButtons } from '@/app/_components/account-buttons/account-buttons.component';
import { ProtocolContracts as Props } from '@/app/_models/protocol-data.model';
import { preventDefault } from '@/app/_utils/events.utils';
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
      <Anchor
        onMouseDown={preventDefault}
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        {clampMiddle(address)}
      </Anchor>
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
