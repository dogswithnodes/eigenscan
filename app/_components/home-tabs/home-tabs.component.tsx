'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { AVSs } from './components/avss/avss.component';
import { Operators } from './components/operators/operators.component';
import { SearchInput } from './components/search-input/search-input.component';
import { Stakers } from './components/stakers/stakers.component';
import { Strategies } from './components/strategies/strategies.component';
import { StyledHomeTabs } from './home-tabs.styled';

import { TabButtons, TabButton, TabContent } from '../tabs/tabs.styled';

import { MAIN_TABLES } from '@/app/_constants/tables.constants';

const searchInputPlaceholders = {
  [MAIN_TABLES.avss]: 'Enter avs id or name',
  [MAIN_TABLES.operators]: 'Enter operator id',
  [MAIN_TABLES.stakers]: 'Enter staker id',
  [MAIN_TABLES.strategies]: 'Enter strategy id or name',
};

export const HomeTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(MAIN_TABLES).some((t) => t === tab.toLowerCase())) {
      replace(`${pathname}?tab=${MAIN_TABLES.avss}`);
    }
  }, [pathname, tab, replace]);

  const isAVSs = !tab || tab === MAIN_TABLES.avss;
  const isOperators = tab === MAIN_TABLES.operators;
  const isStakers = tab === MAIN_TABLES.stakers;
  const isStrategies = tab === MAIN_TABLES.strategies;

  const [searchTerms, setSearchTerms] = useState({
    [MAIN_TABLES.avss]: '',
    [MAIN_TABLES.operators]: '',
    [MAIN_TABLES.stakers]: '',
    [MAIN_TABLES.strategies]: '',
  });

  const searchTerm = tab && tab in searchTerms ? searchTerms[tab] : '';
  const searchInputPlaceholder = tab && tab in searchInputPlaceholders ? searchInputPlaceholders[tab] : '';

  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      if (tab && tab in searchTerms) {
        setSearchTerms((prev) => ({
          ...prev,
          [tab]: searchTerm,
        }));
      }
    },
    [searchTerms, tab],
  );

  return (
    <>
      <StyledHomeTabs>
        <TabButtons>
          <Link prefetch={false} href={{ query: { tab: MAIN_TABLES.avss } }}>
            <TabButton $active={isAVSs}>AVSs</TabButton>
          </Link>
          <Link prefetch={false} href={{ query: { tab: MAIN_TABLES.operators } }}>
            <TabButton $active={isOperators}>Operators</TabButton>
          </Link>
          <Link prefetch={false} href={{ query: { tab: MAIN_TABLES.stakers } }}>
            <TabButton $active={isStakers}>Stakers</TabButton>
          </Link>
          <Link prefetch={false} href={{ query: { tab: MAIN_TABLES.strategies } }}>
            <TabButton $active={isStrategies}>Strategies</TabButton>
          </Link>
        </TabButtons>
        <section className="home-tabs-extra-content">
          <SearchInput
            searchTerm={searchTerm}
            placeholder={searchInputPlaceholder}
            setSearchTerm={setSearchTerm}
          />
        </section>
      </StyledHomeTabs>
      <TabContent>
        {isAVSs && <AVSs searchTerm={searchTerm} />}
        {isOperators && <Operators searchTerm={searchTerm} />}
        {isStakers && <Stakers searchTerm={searchTerm} />}
        {isStrategies && <Strategies searchTerm={searchTerm} />}
      </TabContent>
    </>
  );
};
