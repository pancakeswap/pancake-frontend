import { Fragment, memo } from 'react'
import { Trade, Currency, TradeType } from '@pancakeswap/aptos-swap-sdk'
import { Text, Flex, ChevronRightIcon } from '@pancakeswap/uikit'

export default memo(function SwapRoute({ trade }: { trade: Trade<Currency, Currency, TradeType> }) {
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <Flex alignItems="end">
              <Text fontSize="14px" ml="0.125rem" mr="0.125rem">
                {token.symbol}
              </Text>
            </Flex>
            {!isLastItem && <ChevronRightIcon width="12px" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
