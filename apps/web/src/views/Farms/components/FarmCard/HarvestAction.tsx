import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Heading, TooltipText, useToast, useTooltip, useModal, Balance } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'

import { TransactionResponse } from '@ethersproject/providers'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'
import MultiChainHarvestModal from 'views/Farms/components/MultiChainHarvestModal'

interface FarmCardActionsProps {
  pid?: number
  token?: Token
  quoteToken?: Token
  earnings?: BigNumber
  vaultPid?: number
  proxyCakeBalance?: number
  lpSymbol?: string
  onReward?: () => Promise<TransactionResponse>
  onDone?: () => void
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  earnings,
  proxyCakeBalance,
  lpSymbol,
  onReward,
  onDone,
}) => {
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  const cakePrice = usePriceCakeBusd()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0
  const tooltipBalance = rawEarningsBalance.isGreaterThan(new BigNumber(0.00001)) ? displayBalance : '< 0.00001'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${tooltipBalance} ${t(
      `CAKE has been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`,
    )}`,
    {
      placement: 'bottom',
    },
  )

  const onClickHarvestButton = () => {
    if (vaultPid) {
      onPresentNonBscHarvestModal()
    } else {
      handleHarvest()
    }
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  const [onPresentNonBscHarvestModal] = useModal(
    <MultiChainHarvestModal
      pid={pid}
      token={token}
      lpSymbol={lpSymbol}
      quoteToken={quoteToken}
      earningsBigNumber={earnings}
      earningsBusd={earningsBusd}
    />,
  )

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        {proxyCakeBalance ? (
          <>
            <TooltipText ref={targetRef} decorationColor="secondary">
              <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
            </TooltipText>
            {tooltipVisible && tooltip}
          </>
        ) : (
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        )}
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <Button disabled={rawEarningsBalance.eq(0) || pendingTx} onClick={onClickHarvestButton}>
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
