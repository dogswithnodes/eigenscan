import {
  Container,
  DescriptionHeading,
  DescriptionText,
  Description,
} from '@/app/_components/cards/right-card/right-card.styled';
import { parseLinks } from '@/app/_utils/uri.utils';

export type Props = {
  description: string | undefined;
};

export const DescriptionCard: React.FC<Props> = ({ description }) => {
  return (
    <Container>
      <Description>
        <DescriptionHeading>Description</DescriptionHeading>
        <DescriptionText
          dangerouslySetInnerHTML={{
            __html: parseLinks(description) || 'Description was not provided',
          }}
        />
      </Description>
    </Container>
  );
};
