import { Button, Heading, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from '@pancakeswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useAppDispatch } from 'state'
import { getAddress } from 'utils/addressHelpers'
import { useERC20 } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'

import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount } from 'utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback } from 'react'
import { FarmWithStakedValue } from '../../types'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward?: () => Promise<TransactionResponse>
  proxyCakeBalance?: number
  onDone?: () => void
}

export const ProxyHarvestActionContainer = ({ children, ...props }) => {
  const lpAddress = getAddress(props.lpAddresses)
  const lpContract = useERC20(lpAddress)

  const { onReward, onDone, proxyCakeBalance } = useProxyStakedActions(props.pid, lpContract)

  return children({ ...props, onReward, proxyCakeBalance, onDone })
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid] })),
    [account, dispatch, props.pid],
  )

  return children({ ...props, onDone, onReward })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  onReward,
  onDone,
  userData,
  userDataReady,
  proxyCakeBalance,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = new BigNumber(userData.earnings)
  const cakePrice = usePriceCakeBusd()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />
  const toolTipBalance = earningsBigNumber.isGreaterThan(new BigNumber(0.00001)) ? displayBalance : `< 0.00001`
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${toolTipBalance} ${t(
      `CAKE has been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`,
    )}`,
    {
      placement: 'bottom',
    },
  )

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  return (
    <ActionContainer style={{ minHeight: 124.5 }}>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          {proxyCakeBalance ? (
            <>
              <TooltipText ref={targetRef} decorationColor="secondary">
                <Heading>{displayBalance}</Heading>
              </TooltipText>
              {tooltipVisible && tooltip}
            </>
          ) : (
            <Heading>{displayBalance}</Heading>
          )}
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
          onClick={async () => {
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
          }}
          ml="4px"
        >
          {pendingTx ? t('Harvesting') : t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
