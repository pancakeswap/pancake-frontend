import { useCallback } from 'react'
import { BunnyPlaceholderIcon, AutoRenewIcon, Button, Flex, Grid, Text } from '@pancakeswap/uikit'
import { Collection } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'

interface CollectionNftsProps {
  collection: Collection
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection }) => {
  const { totalSupply, numberTokensListed, address: collectionAddress } = collection
  const { t } = useTranslation()
  const { nfts, isFetchingNfts, size, setSize, showOnlyNftsOnSale, orderField, nftFilters } =
    useCollectionNfts(collectionAddress)

  const handleLoadMore = useCallback(() => {
    setSize(size + 1)
  }, [setSize, size])

  if ((!nfts || nfts?.length === 0) && isFetchingNfts) {
    return <GridPlaceholder />
  }

  const isNotLastPage =
    showOnlyNftsOnSale || orderField !== 'tokenId'
      ? nfts?.length < Number(numberTokensListed)
      : nfts?.length < Number(totalSupply)

  const resultsAmount = showOnlyNftsOnSale || orderField !== 'tokenId' ? numberTokensListed : totalSupply
  // We don't know the amount in advance if nft filters exist
  const resultsAmountToBeShown = !Object.keys(nftFilters).length

  return (
    <>
      {resultsAmountToBeShown && (
        <Flex p="16px">
          <Text bold>
            {resultsAmount} {t('Results')}
          </Text>
        </Flex>
      )}
      {nfts.length > 0 ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.map((nft) => {
              const currentAskPriceAsNumber = nft.marketData && parseFloat(nft.marketData.currentAskPrice)

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
            {isNotLastPage && (
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
