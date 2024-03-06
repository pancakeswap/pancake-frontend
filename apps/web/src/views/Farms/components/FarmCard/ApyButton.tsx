import { useTranslation } from '@pancakeswap/localization'
import { RoiCalculatorModal, Text, TooltipText, useModal, useTooltip } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { MouseEvent } from 'react'

import { useFarmUser } from 'state/farms/hooks'

import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useAccount } from 'wagmi'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpTokenPrice?: BigNumber
  lpLabel?: string
  multiplier?: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  useTooltipText?: boolean
  hideButton?: boolean
  boosted?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  farmCakePerSecond?: string
  totalMultipliers?: string
  boosterMultiplier?: number
  isBooster?: boolean
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
  lpTokenPrice = BIG_ZERO,
  lpSymbol,
  cakePrice,
  apr = 0,
  multiplier,
  displayApr,
  lpRewardsApr = 0,
  addLiquidityUrl,
  useTooltipText,
  hideButton,
  boosted,
  stableSwapAddress,
  stableLpFee,
  farmCakePerSecond,
  totalMultipliers,
  boosterMultiplier = 1,
  isBooster,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { tokenBalance, stakedBalance, proxy } = useFarmUser(pid)
  const userBalanceInFarm = stakedBalance.plus(tokenBalance).gt(0)
    ? stakedBalance.plus(tokenBalance)
    : proxy
    ? proxy.stakedBalance.plus(proxy.tokenBalance)
    : BIG_ZERO

  const boostMultiplierDisplay = boosterMultiplier.toLocaleString(undefined, { maximumFractionDigits: 3 })
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      pid={pid}
      linkLabel={t('Add %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenDecimals={18}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      earningTokenPrice={cakePrice?.toNumber() ?? 0}
      apr={boosterMultiplier ? apr * boosterMultiplier : apr}
      multiplier={multiplier}
      displayApr={boosterMultiplier ? (_toNumber(displayApr) - apr + apr * boosterMultiplier).toFixed(2) : displayApr}
      linkHref={addLiquidityUrl}
      lpRewardsApr={lpRewardsApr}
      isFarm
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
        <Text style={{ display: 'inline-block' }} color={isBooster ? 'secondary' : 'text'} bold>
          {isBooster ? `${(apr * boosterMultiplier + lpRewardsApr).toFixed(2)}%` : `${displayApr}%`}
        </Text>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={isBooster ? 'secondary' : 'normal'} bold>
            {isBooster ? `${(apr * boosterMultiplier).toFixed(2)}%` : `${apr.toFixed(2)}%`}
          </Text>
        </li>
        <li>
          {t('LP Fee APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={isBooster ? 'secondary' : 'normal'} bold>
            {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
          </Text>
        </li>
      </ul>
      {isBooster && (
        <Text>
          {t('Available Boosted')}:{' '}
          <Text color="secondary" style={{ display: 'inline-block' }}>
            {t('Up to %boostMultiplier%x', { boostMultiplier: boostMultiplierDisplay })}
          </Text>
        </Text>
      )}
      {isBooster && <Text color="secondary">{t('Boost only applies to base APR (CAKE yield)')}</Text>}
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <FarmWidget.FarmApyButton
      variant={variant}
      hideButton={hideButton}
      strikethrough={isBooster}
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
    </FarmWidget.FarmApyButton>
  )
}

export default ApyButton
