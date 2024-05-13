type EntityMetadata = {
  name: string;
  website: string;
  description: string;
  logo: string;
  twitter: string;
};

type IdToEntityMetadataMap = Record<string, EntityMetadata>;

export const fetchEntitiesMetadata = async (
  entities: Array<{
    id: string;
    metadataURI: string | null;
  }>,
): Promise<IdToEntityMetadataMap> => {
  const metadata: Array<EntityMetadata> = await Promise.all(
    entities.map(async ({ id, metadataURI }) => {
      const defaultMetadata = {
        name: id,
        logo: '',
        website: 'no data',
        description: 'no data',
        twitter: 'no data',
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

  return entities.reduce<IdToEntityMetadataMap>((map, { id }, i) => {
    map[id] = metadata[i];

    return map;
  }, {});
};
