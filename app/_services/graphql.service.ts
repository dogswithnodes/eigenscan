import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { RequestDocument, Variables, GraphQLClient } from 'graphql-request';

export const REQUEST_LIMIT = 1000;

export const fetchAllConsecutively = async <T extends { id: string }>(
  fetcher: (id: string) => Promise<Array<T>>,
  acc: Array<T> = [],
) => {
  let response: Array<T>;
  do {
    response = await fetcher(acc.at(-1)?.id || '');
    acc.push(...response);
  } while (response.length > 0 && response.length % REQUEST_LIMIT === 0);

  return acc;
};

export const fetchAllParallel = <T>(totalItems: number, fetcher: (skip: number) => Promise<Array<T>>) =>
  Promise.all(
    Array.from(
      {
        length: Math.ceil(totalItems / REQUEST_LIMIT) || 1,
      },
      (_, i) => fetcher(i * REQUEST_LIMIT),
    ),
  ).then((response) => response.flat());

type RemoveIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

export type GraphQLClientRequestHeaders = Headers | Array<Array<string>> | Record<string, string>;

export const request = <T = unknown, V extends Variables = Variables>(
  document: RequestDocument | TypedDocumentNode<T, V>,
  url?: string,
  ...variablesAndRequestHeaders: V extends Record<string, never>
    ? [variables?: V, requestHeaders?: GraphQLClientRequestHeaders]
    : keyof RemoveIndex<V> extends never
      ? [variables?: V, requestHeaders?: GraphQLClientRequestHeaders]
      : [variables: V, requestHeaders?: GraphQLClientRequestHeaders]
) => {
  if (url) {
    const client = new GraphQLClient(url, {
      fetch,
    });
    return client.request<T, V>(document, ...variablesAndRequestHeaders);
  }

  const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

  if (!subgraphUrl) {
    throw 'NEXT_PUBLIC_SUBGRAPH_URL is not defined';
  }
  const client = new GraphQLClient(subgraphUrl, {
    fetch,
  });
  return client.request<T, V>(document, ...variablesAndRequestHeaders);
};
