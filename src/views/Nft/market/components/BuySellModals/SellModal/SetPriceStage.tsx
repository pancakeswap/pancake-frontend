import React, { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, BinanceIcon, ErrorIcon, useTooltip } from '@pancakeswap/uikit'
import { multiplyPriceByAmount } from 'utils/prices'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { useTranslation } from 'contexts/Localization'
import { NftToken } from 'state/nftMarket/types'
import { useGetCollection } from 'state/nftMarket/hooks'
import { Divider } from '../shared/styles'
import { GreyedOutContainer, BnbAmountCell, RightAlignedInput, FeeAmountCell } from './styles'

interface SetPriceStageProps {
  nftToSell: NftToken
  variant: 'set' | 'adjust'
  currentPrice?: string
  lowestPrice?: number
  price: string
  setPrice: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const MIN_PRICE = 0.005
const MAX_PRICE = 10000

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<SetPriceStageProps> = ({
  nftToSell,
  variant,
  lowestPrice,
  currentPrice,
  price,
  setPrice,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const adjustedPriceIsTheSame = variant === 'adjust' && parseFloat(currentPrice) === parseFloat(price)
  const priceIsValid = !price || Number.isNaN(parseFloat(price)) || parseFloat(price) <= 0

  const { creatorFee, tradingFee } = useGetCollection(nftToSell.collectionAddress)
  const creatorFeeAsNumber = parseFloat(creatorFee)
  const tradingFeeAsNumber = parseFloat(tradingFee)
  const bnbPrice = useBNBBusdPrice()
  const priceAsFloat = parseFloat(price)
  const priceInUsd = multiplyPriceByAmount(bnbPrice, priceAsFloat)

  const priceIsOutOfRange = priceAsFloat > MAX_PRICE || priceAsFloat < MIN_PRICE

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'When selling NFTs from this collection, a portion of the BNB paid will be diverted before reaching the seller:',
        )}
      </Text>
      {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to buy & burn CAKE', { percentage: tradingFee })}</Text>
    </>,
    { placement: 'auto' },
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const getButtonText = () => {
    if (variant === 'adjust') {
      if (adjustedPriceIsTheSame || priceIsValid) {
        return t('Input New Sale Price')
      }
      return t('Confirm')
    }
    return t('Enable Listing')
  }
  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {variant === 'set' ? t('Set Price') : t('Adjust Sale Price')}
      </Text>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Set Price')}
        </Text>
        <Flex>
          <Flex flex="1" alignItems="center">
            <BinanceIcon width={24} height={24} mr="4px" />
            <Text bold>WBNB</Text>
          </Flex>
          <Flex flex="2">
            <RightAlignedInput
              scale="sm"
              type="number"
              inputMode="decimal"
              value={price}
              ref={inputRef}
              isWarning={priceIsOutOfRange}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" height="21px" justifyContent="flex-end">
          {!Number.isNaN(priceInUsd) && (
            <Text fontSize="12px" color="textSubtle">
              {`$${priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
          )}
        </Flex>
        {priceIsOutOfRange && (
          <Text fontSize="12px" color="failure">
            {t('Allowed price range is between %minPrice% and %maxPrice% WBNB', {
              minPrice: MIN_PRICE,
              maxPrice: MAX_PRICE,
            })}
          </Text>
        )}
        <Flex mt="8px">
          <Text small color="textSubtle" mr="8px">
            {t('Seller pays %percentage%% platform fee on sale', {
              percentage: creatorFeeAsNumber + tradingFeeAsNumber,
            })}
          </Text>
          <span ref={targetRef}>
            <ErrorIcon />
          </span>
          {tooltipVisible && tooltip}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Platform fee if sold')}
          </Text>
          <FeeAmountCell bnbAmount={priceAsFloat} creatorFee={creatorFeeAsNumber} tradingFee={tradingFeeAsNumber} />
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Lowest price on market')}
          </Text>
          <BnbAmountCell bnbAmount={lowestPrice} />
        </Flex>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The NFT will be removed from your wallet and put on sale at this price.')}
          </Text>
          <Text small color="textSubtle">
            {t('Sales are in WBNB. You can swap WBNB to BNB 1:1 for free with PancakeSwap.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
