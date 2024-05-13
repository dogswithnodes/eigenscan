'use client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { ChildrenProp } from '@/app/_models/children-prop.model';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: 0,
        staleTime: Infinity,
        throwOnError: true,
      },
      mutations: {
        throwOnError: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const Providers: React.FC<ChildrenProp> = ({ children }) => {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
