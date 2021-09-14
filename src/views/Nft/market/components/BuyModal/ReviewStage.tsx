import React from 'react'
import { Flex, Text, Image, Button, ButtonMenu, ButtonMenuItem, Message, LinkExternal } from '@pancakeswap/uikit'
import { FetchStatus } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { BorderedBox, BnbAmountCell, Divider } from './styles'
import { PaymentCurrency } from './types'

interface ReviewStageProps {
  nftToBuy: any
  paymentCurrency: PaymentCurrency
  setPaymentCurrency: (index: number) => void
  nftPrice: number
  walletBalance: number
  walletFetchStatus: FetchStatus
  notEnoughBnbForPurchase: boolean
  continueToNextStage: () => void
}

const ReviewStage: React.FC<ReviewStageProps> = ({
  nftToBuy,
  paymentCurrency,
  setPaymentCurrency,
  nftPrice,
  walletBalance,
  walletFetchStatus,
  notEnoughBnbForPurchase,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <Image src={nftToBuy.image.thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy.collection.name}
            </Text>
            <Text bold>{nftToBuy.name}</Text>
          </Flex>
        </Flex>
        <BorderedBox>
          <Text small color="textSubtle">
            {t('Pay with')}
          </Text>
          <ButtonMenu
            activeIndex={paymentCurrency}
            onItemClick={(index) => setPaymentCurrency(index)}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem>BNB</ButtonMenuItem>
            <ButtonMenuItem>WBNB</ButtonMenuItem>
          </ButtonMenu>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <BnbAmountCell bnbAmount={nftPrice} />
          <Text small color="textSubtle">
            {t('%symbol% in wallet', { symbol: paymentCurrency === PaymentCurrency.BNB ? 'BNB' : 'WBNB' })}
          </Text>
          <BnbAmountCell
            bnbAmount={walletBalance}
            isLoading={walletFetchStatus !== FetchStatus.SUCCESS}
            isInsufficient={walletFetchStatus === FetchStatus.SUCCESS && notEnoughBnbForPurchase}
          />
        </BorderedBox>
        {walletFetchStatus === FetchStatus.SUCCESS && notEnoughBnbForPurchase && (
          <Message p="8px" variant="danger">
            <Text>
              {t('Not enough %symbol% to purchase this NFT', {
                symbol: paymentCurrency === PaymentCurrency.BNB ? 'BNB' : 'WBNB',
              })}
            </Text>
          </Message>
        )}
        <Flex>
          <Text my="16px" mr="4px">
            {t('Convert between BNB and WBNB for free')}:
          </Text>
          <LinkExternal href="google.com">{t('Convert')}</LinkExternal>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="24px" pb="24px" flexDirection="column">
        <Button
          onClick={continueToNextStage}
          disabled={walletFetchStatus !== FetchStatus.SUCCESS || notEnoughBnbForPurchase}
          mb="8px"
        >
          {t('Checkout')}
        </Button>
        <Button variant="secondary">{t('Get %symbol1% or %symbol2%', { symbol1: 'BNB', symbol2: 'WBNB' })}</Button>
      </Flex>
    </>
  )
}

export default ReviewStage
