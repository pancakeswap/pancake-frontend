import { collections } from '.'
import { Collection } from './types'

// Tmp
export const getCollectionFromSlug = (slug: string): { key: string; collection: Collection } => {
  const collectionKey = Object.keys(collections).find((key) => {
    return collections[key].slug.toLowerCase() === slug.toLowerCase()
  })

  return { key: collectionKey, collection: collections[collectionKey] }
}
