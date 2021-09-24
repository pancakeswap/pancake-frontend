import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Card, CardBody, Text, Button, Image, BinanceIcon, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { multiplyPriceByAmount } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import BuyModal from '../../components/BuySellModals/BuyModal'

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
}

const MainNFTCard: React.FC<MainNFTCardProps> = ({ cheapestNft }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(cheapestNft.marketData.currentAskPrice))
  const [onPresentModal] = useModal(<BuyModal nftToBuy={cheapestNft} />)
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <Text bold color="primary" mt={['16px', '16px', '50px']}>
                {cheapestNft.collectionName}
              </Text>
              <Text fontSize="40px" bold mt="12px">
                {cheapestNft.name}
              </Text>
              <Text mt={['16px', '16px', '48px']}>{t(cheapestNft.description)}</Text>
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Lowest price')}
              </Text>
              <Flex alignItems="center" mt="8px">
                <BinanceIcon width={18} height={18} mr="4px" />
                <Text fontSize="24px" bold mr="4px">
                  {cheapestNft.marketData.currentAskPrice}
                </Text>
                <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} USD)`}</Text>
              </Flex>
              <Button minWidth="168px" width={['100%', null, 'max-content']} mt="24px" onClick={onPresentModal}>
                {t('Buy')}
              </Button>
            </Box>
          </Flex>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center">
            <RoundedImage src={cheapestNft.image.original} width={440} height={440} />
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
