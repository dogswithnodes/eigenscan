import { ProtocolEntityMetadata } from '../_models/protocol-entity-metadata.model';

type IdToMetadataMap = Record<string, ProtocolEntityMetadata>;

export const fetchEntitiesMetadata = async (
  entities: Array<{
    id: string;
    metadataURI: string | null;
  }>,
): Promise<IdToMetadataMap> => {
  const metadata: Array<ProtocolEntityMetadata> = await Promise.all(
    entities.map(async ({ metadataURI }) => {
      const defaultMetadata = {
        name: '',
        logo: '',
        website: '',
        description: '',
        twitter: '',
      };

      if (metadataURI) {
        try {
          const res = await fetch(metadataURI);
          return await res.json();
        } catch (err) {
          return defaultMetadata;
        }
      }

      return defaultMetadata;
    }),
  );

  return entities.reduce<IdToMetadataMap>((map, { id }, i) => {
    map[id] = metadata[i];

    return map;
  }, {});
};
