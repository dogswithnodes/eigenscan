'use server';

import { DEFAULT_PROTOCOL_ENTITY_METADATA } from '../_constants/protocol-entity-metadata.constants';
import { ProtocolEntityMetadata } from '../_models/protocol-entity-metadata.model';

const cache = new Map();

const fetchProtocolEntityMetadata = async (uri: string) => {
  const data = cache.get(uri);

  if (data) return data;

  const res = await fetch(uri);

  if (!res.ok) return DEFAULT_PROTOCOL_ENTITY_METADATA;

  const metadata = await res.json();

  if (metadata && typeof metadata === 'object') {
    cache.set(uri, metadata);

    return metadata;
  }

  return DEFAULT_PROTOCOL_ENTITY_METADATA;
};

export const fetchProtocolEntitiesMetadata = async (
  uris: Array<string | null>,
): Promise<Array<ProtocolEntityMetadata>> => {
  const metadataList = await Promise.all(
    uris.map(async (uri) => {
      if (!uri) return DEFAULT_PROTOCOL_ENTITY_METADATA;

      return await fetchProtocolEntityMetadata(uri);
    }),
  );

  return metadataList;
};
