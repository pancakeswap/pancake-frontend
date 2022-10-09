import { Flex, Heading, RefreshIcon, useModal } from '@pancakeswap/uikit'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useMemo } from 'react'
import { useAppDispatch } from 'state'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'
import { useNonBscFarmPendingTransaction } from 'state/transactions/hooks'
import { pickFarmTransactionTx } from 'state/global/actions'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface StakedLPProps {
  lpAddress: string
  stakedBalance: BigNumber
  tokenSymbol: string
  quoteTokenSymbol: string
  lpTotalSupply: BigNumber
  lpTokenPrice: BigNumber
  tokenAmountTotal: BigNumber
  quoteTokenAmountTotal: BigNumber
}

const StakedLP: React.FunctionComponent<React.PropsWithChildren<StakedLPProps>> = ({
  lpAddress,
  stakedBalance,
  quoteTokenSymbol,
  tokenSymbol,
  lpTotalSupply,
  lpTokenPrice,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const pendingFarm = useNonBscFarmPendingTransaction(lpAddress)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  const displayBalance = useMemo(() => {
    return formatLpBalance(stakedBalance)
  }, [stakedBalance])

  const onClickLoadingIcon = () => {
    const { length } = pendingFarm
    if (length) {
      if (length > 1) {
        onPresentTransactionModal()
      } else {
        dispatch(pickFarmTransactionTx({ tx: pendingFarm[0].txid, chainId }))
      }
    }
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Flex>
        <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {pendingFarm.length > 0 && <RefreshIcon style={{ cursor: 'pointer' }} spin onClick={onClickLoadingIcon} />}
      </Flex>
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
