'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { StyledHomeTabs } from './home-tabs.styled';
import { AVSs } from './components/avss/avss.component';
import { Operators } from './components/operators/operators.component';
import { Stakers } from './components/stakers/stakers.component';
import { Strategies } from './components/strategies/strategies.component';
import { SearchInput } from './components/search-input/search-input.component';

import { TabButtons, TabButton, TabContent } from '../tabs/tabs.styled';

const HOME_TABS = {
  avss: 'avss',
  operators: 'operators',
  stakers: 'stakers',
  strategies: 'strategies',
};

const searchInputPlaceholders = {
  [HOME_TABS.avss]: 'Enter avs id or name',
  [HOME_TABS.operators]: 'Enter operator id',
  [HOME_TABS.stakers]: 'Enter staker id',
  [HOME_TABS.strategies]: 'Enter strategy id or name',
};

export const HomeTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!tab || !Object.values(HOME_TABS).some((t) => t === tab.toLowerCase())) {
      replace(`${pathname}?tab=${HOME_TABS.avss}`);
    }
  }, [pathname, tab, replace]);

  const isAVSs = !tab || tab === HOME_TABS.avss;
  const isOperators = tab === HOME_TABS.operators;
  const isStakers = tab === HOME_TABS.stakers;
  const isStrategies = tab === HOME_TABS.strategies;

  const [searchTerms, setSearchTerms] = useState({
    [HOME_TABS.avss]: '',
    [HOME_TABS.operators]: '',
    [HOME_TABS.stakers]: '',
    [HOME_TABS.strategies]: '',
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
          <Link href={{ query: { tab: HOME_TABS.avss } }}>
            <TabButton $active={isAVSs}>AVSs</TabButton>
          </Link>
          <Link href={{ query: { tab: HOME_TABS.operators } }}>
            <TabButton $active={isOperators}>Operators</TabButton>
          </Link>
          <Link href={{ query: { tab: HOME_TABS.stakers } }}>
            <TabButton $active={isStakers}>Stackers</TabButton>
          </Link>
          <Link href={{ query: { tab: HOME_TABS.strategies } }}>
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
