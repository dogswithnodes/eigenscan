'use server';

import { DEFAULT_PROTOCOL_ENTITY_METADATA } from '../_constants/protocol-entity-metadata.constants';
import { ProtocolEntityMetadata } from '../_models/protocol-entity-metadata.model';
import { getCache } from '../_utils/cache';

const cache = getCache(process.env.METADATA_CACHE as unknown as CloudflareEnv['METADATA_CACHE'], 'metadata');

const fetchProtocolEntityMetadata = async (uri: string): Promise<ProtocolEntityMetadata> => {
  const data = await cache.get(uri);

  if (data) return JSON.parse(data) as ProtocolEntityMetadata;

  const res = await fetch(uri);

  if (!res.ok) return DEFAULT_PROTOCOL_ENTITY_METADATA;

  const metadata = await res.json();

  if (metadata && typeof metadata === 'object') {
    await cache.put(uri, JSON.stringify(metadata));

    return metadata as ProtocolEntityMetadata;
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
