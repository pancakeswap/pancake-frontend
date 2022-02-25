import { Grid, Text, Flex, Spinner } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { NftToken } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import GridPlaceholder from '../../components/GridPlaceholder'
import NoNftsImage from '../../components/Activity/NoNftsImage'

const UserNfts: React.FC<{ nfts: NftToken[]; isLoading: boolean }> = ({ nfts, isLoading }) => {
  const { t } = useTranslation()
  const [showMaxItems, setMaxShowItems] = useState(100)

  const { isIntersecting, observerRef } = useIntersectionObserver()

  const isNotLastPage = nfts.length > showMaxItems

  useEffect(() => {
    if (isIntersecting) {
      setMaxShowItems((s) => s + 100)
    }
  }, [isIntersecting])

  return (
    <>
      {/* User has no NFTs */}
      {nfts.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFTs found')}
          </Text>
        </Flex>
      ) : // User has NFTs and data has been fetched
      nfts.length > 0 ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.slice(0, showMaxItems).map((nft) => {
              const { marketData } = nft

              return (
                <CollectibleLinkCard
                  key={`${nft.tokenId}-${nft.collectionName}`}
                  nft={nft}
                  currentAskPrice={
                    marketData?.currentAskPrice && marketData?.isTradable && parseFloat(marketData.currentAskPrice)
                  }
                />
              )
            })}
          </Grid>
          {isNotLastPage && (
            <Flex mt="60px" mb="12px" justifyContent="center" ref={observerRef}>
              <Spinner />
            </Flex>
          )}
        </>
      ) : (
        // User NFT data hasn't been fetched
        <GridPlaceholder />
      )}
    </>
  )
}

export default UserNfts
