import styled from 'styled-components'
import { Modal, Box, Flex, Text, BinanceIcon, Input } from '@pancakeswap/uikit'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { SellingStage } from './types'

export const stagesWithBackButton = [
  SellingStage.SET_PRICE,
  SellingStage.ADJUST_PRICE,
  SellingStage.APPROVE_AND_CONFIRM_SELL,
  SellingStage.CONFIRM_ADJUST_PRICE,
  SellingStage.REMOVE_FROM_MARKET,
  SellingStage.CONFIRM_REMOVE_FROM_MARKET,
  SellingStage.TRANSFER,
  SellingStage.CONFIRM_TRANSFER,
]

export const StyledModal = styled(Modal)<{ stage: SellingStage }>`
  width: 360px;
  & > div:last-child {
    padding: 0;
  }
  & h2:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `color: ${theme.colors.textSubtle}` : null)};
  }
  & svg:first-of-type {
    ${({ stage, theme }) => (stagesWithBackButton.includes(stage) ? `fill: ${theme.colors.textSubtle}` : null)};
  }
`

export const GreyedOutContainer = styled(Box)`
  background-color: ${({ theme }) => theme.colors.dropdown};
  padding: 16px;
`

export const RightAlignedInput = styled(Input)`
  text-align: right;
`

interface BnbAmountCellProps {
  bnbAmount: number
}

export const BnbAmountCell: React.FC<BnbAmountCellProps> = ({ bnbAmount }) => {
  const bnbBusdPrice = useBNBBusdPrice()
  if (!bnbAmount || bnbAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <BinanceIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }
  const usdAmount = multiplyPriceByAmount(bnbBusdPrice, bnbAmount)
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BinanceIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${bnbAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        {`($${usdAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}
      </Text>
    </Flex>
  )
}

interface FeeAmountCellProps {
  bnbAmount: number
  creatorFee: number
  tradingFee: number
}

export const FeeAmountCell: React.FC<FeeAmountCellProps> = ({ bnbAmount, creatorFee, tradingFee }) => {
  if (!bnbAmount || bnbAmount === 0) {
    return (
      <Flex alignItems="center" justifyContent="flex-end">
        <BinanceIcon width={16} height={16} mr="4px" />
        <Text bold mr="4px">
          -
        </Text>
      </Flex>
    )
  }

  const totalFee = creatorFee + tradingFee
  const totalFeeAsDecimal = totalFee / 100
  const feeAmount = bnbAmount * totalFeeAsDecimal
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <BinanceIcon width={16} height={16} mr="4px" />
      <Text bold mr="4px">{`${feeAmount.toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 6,
      })}`}</Text>
      <Text small color="textSubtle" textAlign="right">
        ({totalFee}%)
      </Text>
    </Flex>
  )
}
