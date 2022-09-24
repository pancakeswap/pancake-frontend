import { Flex, Heading } from '@pancakeswap/uikit'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useMemo } from 'react'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'

interface StakedLPProps {
  stakedBalance: BigNumber
  tokenSymbol: string
  quoteTokenSymbol: string
  lpTotalSupply: BigNumber
  lpTokenPrice: BigNumber
  tokenAmountTotal: BigNumber
  quoteTokenAmountTotal: BigNumber
}

const StakedLP: React.FunctionComponent<React.PropsWithChildren<StakedLPProps>> = ({
  stakedBalance,
  quoteTokenSymbol,
  tokenSymbol,
  lpTotalSupply,
  lpTokenPrice,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const displayBalance = useMemo(() => {
    return formatLpBalance(stakedBalance)
  }, [stakedBalance])

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {stakedBalance.gt(0) && lpTokenPrice.gt(0) && (
        <>
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={getBalanceNumber(lpTokenPrice.times(stakedBalance))}
            unit=" USD"
            prefix="~"
          />
          <Flex style={{ gap: '4px' }}>
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              value={stakedBalance.div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
              unit={` ${tokenSymbol}`}
            />
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              value={stakedBalance.div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
              unit={` ${quoteTokenSymbol}`}
            />
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default StakedLP
