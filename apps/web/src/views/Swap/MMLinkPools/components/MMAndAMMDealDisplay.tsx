import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { Box, Text } from '@pancakeswap/uikit'

import { Field } from 'state/swap/actions'
import { TradeWithMM } from '../types'

// for testing purpose, will remove later
export const MMAndAMMDealDisplay: React.FC<{
  independentField: Field
  isMMBetter: boolean
  v2Trade?: Trade<Currency, Currency, TradeType>
  mmTrade?: TradeWithMM<Currency, Currency, TradeType>
}> = ({ isMMBetter = false, independentField, v2Trade, mmTrade }) => {
  const isExactIn = independentField === Field.INPUT
  const dealInANdOut = isExactIn ? '(out)' : '(in)'
  return (
    <Box pl="20px" pt="10px">
      <Text>
        type:{' '}
        <Text display="inline-block" color="textSubtle">
          {isExactIn ? 'ExactIn' : 'ExactOut'}
        </Text>
      </Text>
      <Text>
        <Text display="inline-block" color="transparent">
          A
        </Text>
        MM Deal{dealInANdOut}:{' '}
        <Text display="inline-block" color="textSubtle">
          {(isExactIn ? mmTrade?.outputAmount?.toSignificant(6) : mmTrade?.inputAmount?.toSignificant(6)) ?? 'null'}
        </Text>
      </Text>
      <Text>
        AMM Deal{dealInANdOut}:{' '}
        <Text display="inline-block" color="textSubtle">
          {(isExactIn ? v2Trade?.outputAmount?.toSignificant(6) : v2Trade?.inputAmount?.toSignificant(6)) ?? 'null'}
        </Text>
      </Text>
      <Text>
        MM win: <Text display="inline-block" color="textSubtle">{`${isMMBetter}`}</Text>
      </Text>
    </Box>
  )
}
