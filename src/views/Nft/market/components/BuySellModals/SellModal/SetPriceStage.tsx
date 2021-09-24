import React, { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, BinanceIcon, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Divider } from '../shared/styles'
import { GreyedOutContainer, BnbAmountCell, RightAlignedInput } from './styles'

interface SetPriceStageProps {
  variant: 'set' | 'adjust'
  currentPrice?: string
  lowestPrice?: number
  price: string
  setPrice: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already lsited NFT
const SetPriceStage: React.FC<SetPriceStageProps> = ({
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
        <Flex mt="8px">
          <Flex flex="1" alignItems="center">
            <BinanceIcon width={24} height={24} mr="4px" />
            <Text bold>WBNB</Text>
          </Flex>
          <Flex flex="2">
            <RightAlignedInput
              scale="sm"
              type="number"
              inputMode="numeric"
              value={price}
              ref={inputRef}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="24px">
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
        <Button mb="8px" onClick={continueToNextStage} disabled={priceIsValid || adjustedPriceIsTheSame}>
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
