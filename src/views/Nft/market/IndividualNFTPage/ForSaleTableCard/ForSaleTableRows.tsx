import React from 'react'
import styled from 'styled-components'
import { Price } from '@pancakeswap/sdk'
import { Button, Grid, Text, Flex, Box, BinanceIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { useTranslation } from 'contexts/Localization'
import { shortenAddress } from 'utils'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { CollectibleAndOwnerData } from '../types'

const Avatar = styled.img`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

const OwnersTableRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  align-itmes: center;
  & > div {
    padding-bottom: 16px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  }
`

const ButtonContainer = styled(Box)`
  text-align: right;
  padding-right: 24px;
`

interface RowProps {
  t: ContextApi['t']
  collectibleForSale: CollectibleAndOwnerData
  bnbBusdPrice: Price
}

const Row: React.FC<RowProps> = ({ t, collectibleForSale, bnbBusdPrice }) => {
  const { owner, collectible } = collectibleForSale
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, collectible.cost)
  return (
    <>
      <Box pl="24px">
        <Flex justifySelf="flex-start" alignItems="center" width="max-content">
          <BinanceIcon width="24px" height="24px" mr="8px" />
          <Text bold>{collectible.cost}</Text>
        </Flex>
        <Text fontSize="12px" color="textSubtle">
          {`(~${priceInUsd.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} USD)`}
        </Text>
      </Box>
      <Box>
        <Flex width="max-content" alignItems="center">
          <Avatar src="https://ipfs.io/ipfs/QmYD9AtzyQPjSa9jfZcZq88gSaRssdhGmKqQifUDjGFfXm/twinkle.png" alt="Twinkle" />
          <Box display="inline">
            <Text lineHeight="1.25">{shortenAddress(owner.account)}</Text>
            <Text lineHeight="1.25">{owner.profileName}</Text>
          </Box>
        </Flex>
      </Box>
      <ButtonContainer>
        <Button scale="sm" variant="secondary" maxWidth="128px">
          {t('Buy')}
        </Button>
      </ButtonContainer>
    </>
  )
}

interface ForSaleTableRowsProps {
  collectiblesForSale: CollectibleAndOwnerData[]
}

const MintedTableRows: React.FC<ForSaleTableRowsProps> = ({ collectiblesForSale }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  return (
    <OwnersTableRow>
      {collectiblesForSale.map((collectibleAndOwnerData) => (
        <Row t={t} collectibleForSale={collectibleAndOwnerData} bnbBusdPrice={bnbBusdPrice} />
      ))}
    </OwnersTableRow>
  )
}

export default MintedTableRows
