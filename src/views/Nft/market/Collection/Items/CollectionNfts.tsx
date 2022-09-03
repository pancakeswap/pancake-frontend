import { useCallback } from 'react'
import { BunnyPlaceholderIcon, AutoRenewIcon, Button, Flex, Grid, Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'

interface CollectionNftsProps {
  collection: Collection
}

const CollectionNfts: React.FC<React.PropsWithChildren<CollectionNftsProps>> = ({ collection }) => {
  const { address: collectionAddress } = collection || {}
  const { t } = useTranslation()
  const { nfts, isFetchingNfts, page, setPage, resultSize, isLastPage } = useCollectionNfts(collectionAddress)

  const handleLoadMore = useCallback(() => {
    setPage(page + 1)
  }, [setPage, page])

  if ((!nfts || nfts?.length === 0) && isFetchingNfts) {
    return <GridPlaceholder />
  }

  return (
    <>
      {resultSize && (
        <Flex p="16px">
          <Text bold>
            {resultSize} {t('Results')}
          </Text>
        </Flex>
      )}
      {nfts.length > 0 ? (
        <>
          <Grid
            gap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.map((nft) => {
              const currentAskPriceAsNumber = nft.marketData && parseFloat(nft?.marketData?.currentAskPrice)

              return (
                <CollectibleLinkCard
                  key={nft.tokenId}
                  nft={nft}
                  currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                />
              )
            })}
          </Grid>
          <Flex mt="60px" mb="12px" justifyContent="center">
            {!isLastPage && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                disabled={isFetchingNfts}
                endIcon={isFetchingNfts ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {isFetchingNfts ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No NFTs found')}</Text>
        </Flex>
      )}
    </>
  )
}

export default CollectionNfts
