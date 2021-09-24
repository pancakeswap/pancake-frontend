import React from 'react'
import styled from 'styled-components'
import { Price } from '@pancakeswap/sdk'
import { Button, Grid, Text, Flex, Box, BinanceIcon, useModal, Skeleton } from '@pancakeswap/uikit'
import truncateHash from 'utils/truncateHash'
import { ContextApi } from 'contexts/Localization/types'
import { useTranslation } from 'contexts/Localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import BuyModal from 'views/Nft/market/components/BuySellModals/BuyModal'
import { useProfileForAddress } from 'state/profile/hooks'

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
  nft: NftToken
  bnbBusdPrice: Price
}

const Row: React.FC<RowProps> = ({ t, nft, bnbBusdPrice }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nft.marketData.currentAskPrice))
  const [onPresentModal] = useModal(<BuyModal nftToBuy={nft} />)
  const { profile, isFetching } = useProfileForAddress(nft.marketData.currentSeller)
  const profileName = profile?.hasRegistered ? profile.profile.username : '-'
  return (
    <>
      <Box pl="24px">
        <Flex justifySelf="flex-start" alignItems="center" width="max-content">
          <BinanceIcon width="24px" height="24px" mr="8px" />
          <Text bold>{nft.marketData.currentAskPrice}</Text>
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
          <Avatar src={nft.image.thumbnail} alt="Twinkle" />
          <Box display="inline">
            <Text lineHeight="1.25">{truncateHash(nft.marketData.currentSeller)}</Text>
            {isFetching ? <Skeleton /> : <Text lineHeight="1.25">{profileName}</Text>}
          </Box>
        </Flex>
      </Box>
      <ButtonContainer>
        <Button scale="sm" variant="secondary" maxWidth="128px" onClick={onPresentModal}>
          {t('Buy')}
        </Button>
      </ButtonContainer>
    </>
  )
}

interface ForSaleTableRowsProps {
  nftsForSale: NftToken[]
}

const ForSaleTableRow: React.FC<ForSaleTableRowsProps> = ({ nftsForSale }) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  return (
    <OwnersTableRow>
      {nftsForSale.map((nft) => (
        <Row key={nft.tokenId} t={t} nft={nft} bnbBusdPrice={bnbBusdPrice} />
      ))}
    </OwnersTableRow>
  )
}

export default ForSaleTableRow
