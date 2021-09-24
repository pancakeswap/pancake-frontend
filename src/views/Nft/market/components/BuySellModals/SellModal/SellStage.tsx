import React from 'react'
import { Flex, Grid, Text, Button, Link, BinanceIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BASE_URL } from 'config'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { NftToken } from 'state/nftMarket/types'
import { Divider, RoundedImage } from '../shared/styles'

interface SellStageProps {
  nftToSell: NftToken
  lowestPrice: number
  continueToNextStage: () => void
  continueToTransferStage: () => void
}

// Initial stage when user wants to put their NFT for sale or transfer to another wallet
const SellStage: React.FC<SellStageProps> = ({
  nftToSell,
  lowestPrice,
  continueToNextStage,
  continueToTransferStage,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex p="16px">
        <RoundedImage src={nftToSell.image.thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell.name}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {nftToSell.collectionName}
          </Text>
          <Text small color="textSubtle">
            {t('Lowest price')}
          </Text>
          <Flex alignItems="center" justifyContent="flex-end">
            <BinanceIcon width={16} height={16} mr="4px" />
            <Text small>
              {lowestPrice
                ? lowestPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })
                : '-'}
            </Text>
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
        <Button mb="8px" onClick={continueToNextStage}>
          Sell
        </Button>
        <Button variant="secondary" onClick={continueToTransferStage}>
          Transfer
        </Button>
      </Flex>
    </>
  )
}

export default SellStage
