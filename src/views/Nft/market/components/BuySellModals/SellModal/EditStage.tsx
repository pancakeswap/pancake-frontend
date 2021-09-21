import React from 'react'
import { Flex, Grid, Text, Button, Link, BinanceIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_URL } from 'config'
import { nftsBaseUrl } from 'views/Nft/market'
import { Divider, RoundedImage } from '../shared/styles'
import { SellNFT } from './types'

interface EditStageProps {
  nftToSell: SellNFT
  continueToAdjustPriceStage: () => void
  continueToRemoveFromMarketStage: () => void
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<EditStageProps> = ({
  nftToSell,
  continueToAdjustPriceStage,
  continueToRemoveFromMarketStage,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Flex p="16px">
        <RoundedImage src={nftToSell.thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell.name}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {nftToSell.collection.name}
          </Text>
          <Text small color="textSubtle">
            {t('Lowest price')}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end">
            <BinanceIcon width={16} height={16} mr="4px" />
            <Text small>{nftToSell.lowestPrice}</Text>
          </Flex>
          <Text small color="textSubtle">
            {t('Your price')}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end">
            <BinanceIcon width={16} height={16} mr="4px" />
            <Text small>{nftToSell.currentAskPrice}</Text>
          </Flex>
        </Grid>
      </Flex>
      <Flex justifyContent="center" mt="8px">
        <Button
          as={Link}
          p="0px"
          height="16px"
          external
          variant="text"
          // TODO: make sure this link is correct
          href={`${BASE_URL}${nftsBaseUrl}/items/${nftToSell.tokenId}`}
        >
          {t('View Item Page')}
        </Button>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToAdjustPriceStage}>
          Adjust Sale Price
        </Button>
        <Button variant="danger" onClick={continueToRemoveFromMarketStage}>
          Remove from Market
        </Button>
      </Flex>
    </>
  )
}

export default EditStage
