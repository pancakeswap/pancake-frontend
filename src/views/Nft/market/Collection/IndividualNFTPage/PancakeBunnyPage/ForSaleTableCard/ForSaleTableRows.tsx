import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Price } from '@pancakeswap/sdk'
import { Button, Grid, Text, Flex, Box, BinanceIcon, useModal, Skeleton } from '@pancakeswap/uikit'
import { formatNumber } from 'utils/formatBalance'
import { ContextApi } from 'contexts/Localization/types'
import { useTranslation } from 'contexts/Localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import BuyModal from 'views/Nft/market/components/BuySellModals/BuyModal'
import SellModal from 'views/Nft/market/components/BuySellModals/SellModal'
import ProfileCell from 'views/Nft/market/components/ProfileCell'
import { ButtonContainer } from '../../shared/styles'

const OwnersTableRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  & > div {
    padding-bottom: 16px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  }
`

interface RowProps {
  t: ContextApi['t']
  nft: NftToken
  bnbBusdPrice: Price
  account: string
  onSuccessSale: () => void
}

const Row: React.FC<RowProps> = ({ t, nft, bnbBusdPrice, account, onSuccessSale }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nft.marketData.currentAskPrice))

  const ownNft = account ? nft.marketData.currentSeller === account.toLowerCase() : false
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant="edit" nftToSell={nft} onSuccessSale={onSuccessSale} />,
  )

  return (
    <>
      <Box pl="24px">
        <Flex justifySelf="flex-start" alignItems="center" width="max-content">
          <BinanceIcon width="24px" height="24px" mr="8px" />
          <Text bold>{formatNumber(parseFloat(nft.marketData.currentAskPrice), 0, 5)}</Text>
        </Flex>
        {bnbBusdPrice ? (
          <Text fontSize="12px" color="textSubtle">
            {`(~${formatNumber(priceInUsd, 2, 2)} USD)`}
          </Text>
        ) : (
          <Skeleton width="86px" height="12px" mt="4px" />
        )}
      </Box>
      <Box>
        <Flex width="max-content" alignItems="center">
          <ProfileCell accountAddress={nft.marketData.currentSeller} />
        </Flex>
      </Box>
      <ButtonContainer>
        {ownNft ? (
          <Button scale="sm" variant="danger" maxWidth="128px" onClick={onPresentAdjustPriceModal}>
            {t('Edit')}
          </Button>
        ) : (
          <Button scale="sm" variant="secondary" maxWidth="128px" onClick={onPresentBuyModal}>
            {t('Buy')}
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

interface ForSaleTableRowsProps {
  nftsForSale: NftToken[]
  onSuccessSale: () => void
}

const ForSaleTableRow: React.FC<ForSaleTableRowsProps> = ({ nftsForSale, onSuccessSale }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()
  return (
    <OwnersTableRow>
      {nftsForSale.map((nft) => (
        <Row
          key={nft.tokenId}
          t={t}
          nft={nft}
          bnbBusdPrice={bnbBusdPrice}
          account={account}
          onSuccessSale={onSuccessSale}
        />
      ))}
    </OwnersTableRow>
  )
}

export default ForSaleTableRow
