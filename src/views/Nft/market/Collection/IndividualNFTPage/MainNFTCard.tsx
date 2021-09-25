import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Card, CardBody, Text, Button, Image, BinanceIcon, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { multiplyPriceByAmount } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import BuyModal from '../../components/BuySellModals/BuyModal'
import SellModal from '../../components/BuySellModals/SellModal'

const RoundedImage = styled(Image)`
  height: max-content;
  border-radius: ${({ theme }) => theme.radii.default};
  overflow: hidden;
  & > img {
    object-fit: contain;
  }
`

const Container = styled(Flex)`
  gap: 24px;
`

interface MainNFTCardProps {
  cheapestNft: NftToken
  cheapestNftFromOtherSellers?: NftToken
}

const MainNFTCard: React.FC<MainNFTCardProps> = ({ cheapestNft, cheapestNftFromOtherSellers }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()

  const nftToDisplay = cheapestNftFromOtherSellers ?? cheapestNft
  const onlyOwnNftsOnSale = !cheapestNftFromOtherSellers

  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nftToDisplay.marketData.currentAskPrice))
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nftToDisplay} />)
  const [onPresentAdjustPriceModal] = useModal(<SellModal variant="edit" nftToSell={cheapestNft} />)
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <Text bold color="primary" mt={['16px', '16px', '50px']}>
                {nftToDisplay.collectionName}
              </Text>
              <Text fontSize="40px" bold mt="12px">
                {nftToDisplay.name}
              </Text>
              <Text mt={['16px', '16px', '48px']}>{t(nftToDisplay.description)}</Text>
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Lowest price')}
              </Text>
              <Flex alignItems="center" mt="8px">
                <BinanceIcon width={18} height={18} mr="4px" />
                <Text fontSize="24px" bold mr="4px">
                  {nftToDisplay.marketData.currentAskPrice}
                </Text>
                <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} USD)`}</Text>
              </Flex>
              {onlyOwnNftsOnSale ? (
                <Button
                  variant="danger"
                  minWidth="168px"
                  width={['100%', null, 'max-content']}
                  mt="24px"
                  onClick={onPresentAdjustPriceModal}
                >
                  {t('Adjust Sale Price')}
                </Button>
              ) : (
                <Button
                  disabled={onlyOwnNftsOnSale}
                  minWidth="168px"
                  width={['100%', null, 'max-content']}
                  mt="24px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                </Button>
              )}
            </Box>
          </Flex>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center">
            <RoundedImage src={nftToDisplay.image.original} width={440} height={440} />
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
