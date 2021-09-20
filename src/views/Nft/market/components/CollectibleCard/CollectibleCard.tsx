import React from 'react'
import { Box, CardBody, CardProps, Flex, Text } from '@pancakeswap/uikit'
import { Link, useRouteMatch } from 'react-router-dom'
import minBy from 'lodash/minBy'
import { useTranslation } from 'contexts/Localization'
import { NFT, NftLocation } from 'state/nftMarket/types'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow, StyledCollectibleCard } from './styles'
import LocationTag from './LocationTag'

export interface CollectibleCardProps extends CardProps {
  nft: NFT
  nftLocation?: NftLocation
  currentAskPrice?: number
}

const CollectibleCard: React.FC<CollectibleCardProps> = ({ nft, nftLocation, currentAskPrice, ...props }) => {
  const { t } = useTranslation()
  const { name, image, tokens } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const { url } = useRouteMatch()

  const lowestPriceToken = tokens && minBy(Object.values(tokens), 'currentAskPrice')
  const lowestPriceNum = lowestPriceToken ? parseFloat(lowestPriceToken.currentAskPrice) : 0

  return (
    <StyledCollectibleCard {...props}>
      <Link to={`${url}/collections/${nft.collectionAddress}/${nft.tokenId}`}>
        <CardBody p="8px">
          <PreviewImage src={image.thumbnail} height={320} width={320} mb="8px" />
          <Flex alignItems="center" justifyContent="space-between">
            {nft.collectionName && (
              <Text fontSize="12px" color="textSubtle" mb="8px">
                {nft.collectionName}
              </Text>
            )}
            {nftLocation && <LocationTag nftLocation={nftLocation} />}
          </Flex>
          <Text as="h4" fontWeight="600" mb="8px">
            {name}
          </Text>
          {(lowestPriceToken || currentAskPrice) && (
            <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
              {lowestPriceToken && (
                <MetaRow title={t('Lowest price')}>
                  <CostLabel cost={lowestPriceNum} bnbBusdPrice={bnbBusdPrice} />
                </MetaRow>
              )}
              {currentAskPrice && (
                <MetaRow title={t('Your price')}>
                  <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
                </MetaRow>
              )}
            </Box>
          )}
        </CardBody>
      </Link>
    </StyledCollectibleCard>
  )
}

export default CollectibleCard
