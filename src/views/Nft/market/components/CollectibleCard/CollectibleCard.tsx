import React from 'react'
import { Box, CardBody, CardProps, Flex, Text } from '@pancakeswap/uikit'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow, ProfileNftTag, SellingNftTag, StyledCollectibleCard, WalletNftTag } from './styles'
import { Collectible } from './types'

export interface CollectibleCardProps extends CardProps {
  collectible: Collectible
}

const CollectibleCard: React.FC<CollectibleCardProps> = ({ collectible, ...props }) => {
  const { name, status, cost, lowestCost, nft } = collectible
  const bnbBusdPrice = useBNBBusdPrice()

  return (
    <StyledCollectibleCard {...props}>
      <CardBody p="8px">
        <PreviewImage src={`/images/nfts/${nft.images.lg}`} height={320} width={320} mb="8px" />
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {name}
          </Text>
          {status === 'profile' && <ProfileNftTag />}
          {status === 'selling' && <SellingNftTag />}
          {status === 'wallet' && <WalletNftTag />}
        </Flex>
        <Text as="h4" fontWeight="600" mb="8px">
          {nft.name}
        </Text>
        <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
          <MetaRow title="Price">
            <CostLabel cost={cost} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
          {lowestCost && (
            <MetaRow title="Lowest price">
              <CostLabel cost={lowestCost} bnbBusdPrice={bnbBusdPrice} />
            </MetaRow>
          )}
        </Box>
      </CardBody>
    </StyledCollectibleCard>
  )
}

export default CollectibleCard
