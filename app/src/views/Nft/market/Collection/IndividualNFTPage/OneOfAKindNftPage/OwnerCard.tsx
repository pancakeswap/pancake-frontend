import React from 'react'
import styled from 'styled-components'
import { Flex, Card, Grid, SellIcon, Text, useModal, Box, BinanceIcon, Skeleton, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import useNftOwner from 'views/Nft/market/hooks/useNftOwner'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import ProfileCell from '../../../components/ProfileCell'
import { ButtonContainer, TableHeading } from '../shared/styles'

const StyledCard = styled(Card)`
  width: 100%;
  & > div:first-child {
    display: flex;
    flex-direction: column;
  }
`

const OwnerRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
`

interface OwnerCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const OwnerCard: React.FC<OwnerCardProps> = ({ nft, isOwnNft, nftIsProfilePic, onSuccess }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const bnbBusdPrice = useBNBBusdPrice()

  const { owner, isLoadingOwner } = useNftOwner(nft)

  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nft.marketData?.currentAskPrice))

  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant={nft.marketData?.isTradable ? 'edit' : 'sell'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )

  return (
    <StyledCard>
      <Grid
        flex="0 1 auto"
        gridTemplateColumns="34px 1fr"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        <SellIcon width="24px" height="24px" />
        <Text bold>{t('Owner')}</Text>
      </Grid>
      {owner && (
        <>
          <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
            <Flex alignItems="center">
              <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px" px="24px">
                {t('Price')}
              </Text>
            </Flex>
            <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px">
              {t('Owner')}
            </Text>
          </TableHeading>
          <OwnerRow>
            <Box pl="24px">
              {nft.marketData?.isTradable ? (
                <>
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
                </>
              ) : (
                <Flex alignItems="center" height="100%">
                  <Text>{t('Not for sale')}</Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Flex width="max-content" alignItems="center">
                <ProfileCell accountAddress={owner.toLowerCase()} />
              </Flex>
            </Box>
            <ButtonContainer>
              {isOwnNft ? (
                <Button
                  disabled={nftIsProfilePic}
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentAdjustPriceModal}
                >
                  {nft.marketData?.isTradable ? t('Manage') : t('Sell')}
                </Button>
              ) : (
                <Button
                  disabled={!nft.marketData?.isTradable}
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                </Button>
              )}
            </ButtonContainer>
          </OwnerRow>
        </>
      )}
      {isLoadingOwner && <Skeleton />}
      {!isLoadingOwner && !owner && (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>{t('Owner information is not available for this item')}</Text>
        </Flex>
      )}
    </StyledCard>
  )
}

export default OwnerCard
