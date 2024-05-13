import React, { useContext } from 'react';

import {
  Wrapper,
  Container,
  LeftSide,
  Result,
  PaginationContainer,
  DownloadButtonContainer,
} from './table-footer.styled';
import { DownloadButton } from './download-button/download-button.component';
import { Pagination } from './pagination/pagination.component';

import { DownloadButtonProps, PaginationProps } from '../../table.model';

import { DocsLinks } from '@/app/_components/docs-links/docs-links.component';
import { GLOBAL_TOOLTIP_ID } from '@/app/_constants/tooltip.constants';

type Props = {
  downloadCsvOptions: DownloadButtonProps;
  hasData: boolean;
  paginationOptions: PaginationProps;
};

const PaginationContext = React.createContext<PaginationProps | undefined>(undefined);

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);

  if (typeof context === 'undefined') {
    throw 'usePaginationContext must be used within PaginationContext';
  }

  return context;
};

export const TableFooter: React.FC<Props> = ({
  downloadCsvOptions,
  hasData,
  paginationOptions,
  paginationOptions: { total },
}) => {
  return (
    <Wrapper>
      <Container $isLogoOnly={!hasData}>
        {hasData && (
          <>
            <LeftSide>
              <Result>
                {total} result{total !== 1 && 's'}
              </Result>
              <DownloadButtonContainer
                data-tooltip-id={GLOBAL_TOOLTIP_ID}
                data-tooltip-content="Download data as CSV."
              >
                <DownloadButton {...downloadCsvOptions} />
              </DownloadButtonContainer>
            </LeftSide>
            <PaginationContainer>
              <PaginationContext.Provider value={paginationOptions}>
                <Pagination />
              </PaginationContext.Provider>
            </PaginationContainer>
          </>
        )}
        <DocsLinks />
      </Container>
    </Wrapper>
  );
};
