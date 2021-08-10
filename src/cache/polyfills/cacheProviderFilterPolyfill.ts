import { CacheProvider } from '@src/core'
import { CacheStorageKey } from '@src/cache/interfaces/CacheStorageKey'

export async function cacheProviderFilterPolyfill<K = string, V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey, predicate: (value: V, key: K, provider: P) => boolean | Promise<boolean>
): Promise<[ K, V ][]> {
  const results: [ K, V ][] = []

  await provider.forEach<K, V>(keyspace, storage, async (value, key) => {
    if (await predicate(value, key, provider)) {
      results.push([ key, value ])
    }
  })

  return results
}
