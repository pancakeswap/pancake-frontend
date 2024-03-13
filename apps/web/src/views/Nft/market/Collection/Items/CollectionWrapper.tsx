import { Box } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { Collection } from 'state/nftMarket/types'
import CollectionNfts from './CollectionNfts'
import Filters from './Filters'

interface CollectionWrapperProps {
  collection?: Collection
}

const CollectionWrapper: React.FC<React.PropsWithChildren<CollectionWrapperProps>> = ({ collection }) => {
  return (
    <Box py="32px">
      <Container px={[0, null, '24px']}>
        <Filters address={collection?.address || ''} attributes={collection?.attributes ?? []} />
      </Container>
      <Container>
        <CollectionNfts collection={collection} />
      </Container>
    </Box>
  )
}

export default CollectionWrapper
