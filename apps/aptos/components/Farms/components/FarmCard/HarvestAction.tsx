import { Token } from '@pancakeswap/aptos-swap-sdk'
import { useAccount } from '@pancakeswap/awgmi'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, useMatchBreakpoints, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { EarnedTokenInfo } from 'components/Farms/components/FarmCard/EarnedTokenInfo'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CAKE } from 'config/coins'
import useCatchTxError from 'hooks/useCatchTxError'
import { useActiveChainId } from 'hooks/useNetwork'
import { usePriceCakeUsdc, useTokenUsdcPrice } from 'hooks/useStablePrice'
import { useMemo } from 'react'

interface FarmCardActionsProps {
  isTableView?: boolean
  pid?: number
  earnings?: BigNumber
  dual?: {
    token: Token
  }
  earningsDualTokenBalance?: BigNumber
  onReward: () => Promise<TransactionResponse>
  onDone?: () => void
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  isTableView,
  earnings,
  dual,
  earningsDualTokenBalance,
  onReward,
  onDone,
}) => {
  const { t } = useTranslation()
  const chainId = useActiveChainId()
  const { account } = useAccount()
  const { isDesktop, isTablet } = useMatchBreakpoints()
  const isUserIpPass = useCheckIsUserIpPass()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const cakePrice = usePriceCakeUsdc()
  // Smaller than 0.00000001 should show 0.
  const rawEarningsBalance =
    account && earnings?.gte(1) ? getBalanceAmount(earnings as BigNumber, FARM_DEFAULT_DECIMALS) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.times(cakePrice ?? 0).toNumber() : 0

  // Dual Token
  const dualEarningsBalance =
    account && earningsDualTokenBalance?.gte(1)
      ? getBalanceAmount(earningsDualTokenBalance as BigNumber, dual?.token?.decimals)
      : BIG_ZERO
  const dualTokenDisplayBalance = dualEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const dualTokenPrice = useTokenUsdcPrice(dual?.token)
  const dualTokenUsdc = dualTokenDisplayBalance ? dualEarningsBalance.times(dualTokenPrice ?? 0).toNumber() : 0

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => onReward())

    if (receipt?.status) {
      const displaySymbol = dual?.token ? `CAKE + ${dual?.token?.symbol}` : 'CAKE'
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: displaySymbol })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  const showCustomTableCss = useMemo(() => isTableView && (isDesktop || isTablet), [isDesktop, isTablet, isTableView])

  return (
    <Flex mb="8px" flexDirection="column">
      <Flex flexDirection={showCustomTableCss ? 'row' : 'column'}>
        <EarnedTokenInfo
          token={CAKE[chainId]}
          displayBalance={displayBalance}
          earningsBalance={rawEarningsBalance}
          earningsBusd={earningsBusd}
        />
        {dual?.token && (
          <Box width={showCustomTableCss ? '50%' : '100%'} mt={showCustomTableCss ? '0' : '16px'}>
            <EarnedTokenInfo
              token={dual.token}
              displayBalance={dualTokenDisplayBalance}
              earningsBalance={dualEarningsBalance}
              earningsBusd={dualTokenUsdc}
            />
          </Box>
        )}
      </Flex>
      <Button mt="16px" disabled={rawEarningsBalance.eq(0) || pendingTx || !isUserIpPass} onClick={handleHarvest}>
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
