import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Card, CardBody, Text, Button, Image, BinanceIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { multiplyPriceByAmount } from 'utils/prices'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { Collectible } from './types'

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
  collectible: Collectible
}

const MainNFTCard: React.FC<MainNFTCardProps> = ({ collectible }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, collectible.lowestCost)
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <Text bold color="primary" mt={['16px', '16px', '50px']}>
                {collectible.name}
              </Text>
              <Text fontSize="40px" bold mt="12px">
                {collectible.nft.name}
              </Text>
              <Text mt={['16px', '16px', '48px']}>{t(collectible.nft.description)}</Text>
              <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                {t('Lowest price')}
              </Text>
              <Flex alignItems="center" mt="8px">
                <BinanceIcon width={18} height={18} mr="4px" />
                <Text fontSize="24px" bold mr="4px">
                  {collectible.lowestCost}
                </Text>
                <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} USD)`}</Text>
              </Flex>
              <Button minWidth="168px" width={['100%', null, 'max-content']} mt="24px">
                {t('Buy')}
              </Button>
            </Box>
          </Flex>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center">
            <RoundedImage src={collectible.nft.images.ipfs} width={440} height={440} />
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
