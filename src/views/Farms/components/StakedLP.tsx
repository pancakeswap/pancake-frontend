import { Flex, Heading, RefreshIcon } from '@pancakeswap/uikit'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useLpTokenPrice } from 'state/farms/hooks'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'
import { useNonBscFarmPendingTransaction } from 'state/transactions/hooks'
import { pickFarmTransactionTx } from 'state/global/actions'

interface StackedLPProps {
  lpAddress: string
  stakedBalance: BigNumber
  lpSymbol: string
  tokenSymbol: string
  quoteTokenSymbol: string
  lpTotalSupply: BigNumber
  tokenAmountTotal: BigNumber
  quoteTokenAmountTotal: BigNumber
}

const StakedLP: React.FunctionComponent<React.PropsWithChildren<StackedLPProps>> = ({
  lpAddress,
  stakedBalance,
  lpSymbol,
  quoteTokenSymbol,
  tokenSymbol,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const dispatch = useAppDispatch()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const pendingFarm = useNonBscFarmPendingTransaction(lpAddress)

  const displayBalance = useMemo(() => {
    return formatLpBalance(stakedBalance)
  }, [stakedBalance])

  const onClickLoadingIcon = () => {
    dispatch(pickFarmTransactionTx({ tx: pendingFarm.txid }))
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Flex>
        <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {pendingFarm && <RefreshIcon style={{ cursor: 'pointer' }} spin onClick={onClickLoadingIcon} />}
      </Flex>
      {stakedBalance.gt(0) && lpPrice.gt(0) && (
        <>
          <Balance
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            value={getBalanceNumber(lpPrice.times(stakedBalance))}
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
