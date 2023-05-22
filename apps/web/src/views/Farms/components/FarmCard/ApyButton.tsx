import { useContext, useState, MouseEvent } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Text, TooltipText, useModal, useTooltip, Farm as FarmUI, RoiCalculatorModal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'

import BCakeCalculator from 'views/Farms/components/YieldBooster/components/BCakeCalculator'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'

import { useAccount } from 'wagmi'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import useBoostMultiplier from '../YieldBooster/hooks/useBoostMultiplier'
import { useGetBoostedMultiplier } from '../YieldBooster/hooks/useGetBoostedAPR'
import { YieldBoosterState } from '../YieldBooster/hooks/useYieldBoosterState'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpTokenPrice: BigNumber
  lpLabel?: string
  multiplier: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  strikethrough?: boolean
  useTooltipText?: boolean
  hideButton?: boolean
  boosted?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  farmCakePerSecond?: string
  totalMultipliers?: string
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
  lpTokenPrice,
  lpSymbol,
  cakePrice,
  apr = 0,
  multiplier,
  displayApr,
  lpRewardsApr,
  addLiquidityUrl,
  strikethrough,
  useTooltipText,
  hideButton,
  boosted,
  stableSwapAddress,
  stableLpFee,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [bCakeMultiplier, setBCakeMultiplier] = useState<number | null>(() => null)
  const { tokenBalance, stakedBalance, proxy } = useFarmUser(pid)
  const { lpTokenStakedAmount } = useFarmFromPid(pid)
  const { boosterState, proxyAddress } = useContext(YieldBoosterStateContext)

  const userBalanceInFarm = stakedBalance.plus(tokenBalance).gt(0)
    ? stakedBalance.plus(tokenBalance)
    : proxy.stakedBalance.plus(proxy.tokenBalance)
  const boosterMultiplierFromFE = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  const boostMultiplierFromSC = useBoostMultiplier({ pid, boosterState, proxyAddress })
  const boostMultiplier = userBalanceInFarm.eq(0)
    ? boostMultiplierFromSC
    : userBalanceInFarm.gt(0) && boosterState === YieldBoosterState.ACTIVE
    ? boostMultiplierFromSC
    : boosterMultiplierFromFE
  const boostMultiplierDisplay = boostMultiplier.toLocaleString(undefined, { maximumFractionDigits: 3 })
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      pid={pid}
      linkLabel={t('Add %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenDecimals={18}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      earningTokenPrice={cakePrice?.toNumber()}
      apr={bCakeMultiplier ? apr * bCakeMultiplier : apr}
      multiplier={multiplier}
      displayApr={bCakeMultiplier ? (_toNumber(displayApr) - apr + apr * bCakeMultiplier).toFixed(2) : displayApr}
      linkHref={addLiquidityUrl}
      isFarm
      bCakeCalculatorSlot={(calculatorBalance) =>
        boosted ? (
          <BCakeCalculator
            targetInputBalance={calculatorBalance}
            earningTokenPrice={cakePrice?.toNumber()}
            lpTokenStakedAmount={lpTokenStakedAmount}
            setBCakeMultiplier={setBCakeMultiplier}
          />
        ) : null
      }
      stableSwapAddress={stableSwapAddress}
      stableLpFee={stableLpFee}
      farmCakePerSecond={farmCakePerSecond}
      totalMultipliers={totalMultipliers}
    />,
    false,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event: MouseEvent): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:{' '}
        <Text style={{ display: 'inline-block' }} color={strikethrough && 'secondary'} bold>
          {strikethrough ? `${(apr * boostMultiplier + lpRewardsApr).toFixed(2)}%` : `${displayApr}%`}
        </Text>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={strikethrough ? 'secondary' : 'normal'} bold>
            {strikethrough ? `${(apr * boostMultiplier).toFixed(2)}%` : `${apr.toFixed(2)}%`}
          </Text>
        </li>
        <li>
          {t('LP Fee APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={strikethrough ? 'secondary' : 'normal'} bold>
            {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
          </Text>
        </li>
      </ul>
      {strikethrough && (
        <Text>
          {t('Available Boosted')}:{' '}
          <Text color="secondary" style={{ display: 'inline-block' }}>
            {t('Up to %boostMultiplier%x', { boostMultiplier: boostMultiplierDisplay })}
          </Text>
        </Text>
      )}
      {strikethrough && <Text color="secondary">{t('Boost only applies to base APR (CAKE yield)')}</Text>}
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <FarmUI.FarmApyButton
      variant={variant}
      hideButton={hideButton}
      strikethrough={strikethrough}
      handleClickButton={handleClickButton}
    >
      {useTooltipText ? (
        <>
          <TooltipText ref={targetRef} decorationColor="secondary">
            {displayApr}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </>
      ) : (
        <>{displayApr}%</>
      )}
    </FarmUI.FarmApyButton>
  )
}

export default ApyButton
