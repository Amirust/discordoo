import { CacheProvider, CacheStorageKey } from '../../../../providers/src/_index'

export async function cacheProviderValuesPolyfill<V = any, P extends CacheProvider = CacheProvider>(
  provider: P, keyspace: string, storage: CacheStorageKey
): Promise<V[]> {
  const values: any[] = []

  await provider.forEach(keyspace, storage, v => {
    values.push(v)
  })

  return values
}