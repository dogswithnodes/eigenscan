export interface Cache {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export function getCache(namespace: KVNamespace | undefined, cacheName?: string): Cache {
  //  seems like dev platform declares KV namespace always
  if (!namespace) {
    // eslint-disable-next-line no-console
    console.log('Using in-memory cache for ', cacheName);
    // return basic in memory Map cache
    const cache = new Map<string, string>();
    return {
      async get(key: string) {
        return cache.get(key) ?? null;
      },
      async put(key: string, value: string) {
        cache.set(key, value);
      },
    };
  }
  // eslint-disable-next-line no-console
  console.log('Using KV cache for ', cacheName);
  return namespace; // use instance as interface directly;
}
