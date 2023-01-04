import { InMemoryCache } from '@apollo/client'
import { Reference, relayStylePagination } from '@apollo/client/utilities'
import { MMKVWrapper, persistCache } from 'apollo3-cache-persist'
import { logger } from 'src/utils/logger'

/**
 * Initializes and persists/rehydrates cache
 * @param storage MMKV wrapper to use as storage
 * @returns
 */
export async function initAndPersistCache(storage: MMKVWrapper): Promise<InMemoryCache> {
  const cache = setupCache()

  try {
    await persistCache({
      cache,
      storage,
    })
  } catch (e) {
    logger.error('data/cache', 'setupCache', `Non-fatal error while restoring Apollo cache: ${e}`)
  }

  return cache
}

function setupCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // relayStylePagination function unfortunately generates a field policy that ignores args
          nftBalances: relayStylePagination(['ownerAddress']),
          nftAssets: relayStylePagination(['address']),

          /*
           * CACHE REDIRECTS
           *
           * when querie