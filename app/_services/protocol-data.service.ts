import { gql } from 'graphql-request';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { request } from './graphql.service';

import { ProtocolData } from '../_models/protocol-data.model';

type ProtocolDataResponse = {
  eigenLayer: ProtocolData;
};

export const fetchProtocolData = async () => {
  const { eigenLayer } = await request<ProtocolDataResponse>(gql`
    query {
      eigenLayer(id: "0") {
        id
        avsCount
        avsDirectory
        delegationManager
        eigenPodManager
        operatorsCount
        slasher
        stakersCount
        stakersWhoDelegateCount
        strategiesCount
        strategyManager
      }
    }
  `);

  return eigenLayer;
};

export const useProtocolData = (options?: Omit<UseQueryOptions<ProtocolData>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: ['protocol-data'],
    queryFn: fetchProtocolData,
    ...options,
  });
