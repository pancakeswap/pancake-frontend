import React, { useRef } from 'react'
import { Collection } from 'state/nftMarket/types'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'

interface CollectionWrapperProps {
  collection: Collection
}

const CollectionWrapper: React.FC<CollectionWrapperProps> = ({ collection }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToTop = (): void => {
    scrollRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <div ref={scrollRef}>
      <Filters collection={collection} />
      <CollectionNfts collection={collection} scrollToTop={scrollToTop} />
    </div>
  )
}

export default CollectionWrapper
