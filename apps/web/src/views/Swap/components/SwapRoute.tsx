import { Currency } from '@pancakeswap/sdk'
import { ChevronRightIcon, Flex, Text } from '@pancakeswap/uikit'
import { Fragment, memo } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'

export default memo(function SwapRoute({ path }: { path: Currency[] }) {
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
      {path.map((token, i) => {
        const isLastItem: boolean = i === path.length - 1
        const currency = token.isToken ? unwrappedToken(token) : token
        return (
          <Fragment key={token.isToken ? token.address : ''}>
            <Flex alignItems="end">
              <Text fontSize="14px" ml="0.125rem" mr="0.125rem">
                {currency.symbol}
              </Text>
            </Flex>
            {!isLastItem && <ChevronRightIcon width="12px" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
