import { useContext, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { Text, TooltipText, useModal, useTooltip, Farm as FarmUI, RoiCalculatorModal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import BCakeCalculator from 'views/Farms/components/YieldBooster/components/BCakeCalculator'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
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
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
  lpTokenPrice,
  lpSymbol,
  cakePrice,
  apr,
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
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
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
      linkLabel={t('Get %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenDecimals={18}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      earningTokenPrice={cakePrice.toNumber()}
      apr={bCakeMultiplier ? apr * bCakeMultiplier : apr}
      multiplier={multiplier}
      displayApr={bCakeMultiplier ? (_toNumber(displayApr) - apr + apr * bCakeMultiplier).toFixed(2) : displayApr}
      linkHref={addLiquidityUrl}
      isFarm
      bCakeCalculatorSlot={(calculatorBalance) =>
        boosted ? (
          <BCakeCalculator
            targetInputBalance={calculatorBalance}
            earningTokenPrice={cakePrice.toNumber()}
            lpTokenStakedAmount={lpTokenStakedAmount}
            setBCakeMultiplier={setBCakeMultiplier}
          />
        ) : null
      }
      stableSwapAddress={stableSwapAddress}
      stableLpFee={stableLpFee}
    />,
    false,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('APR (incl. LP rewards)')}:{' '}
        <Text style={{ display: 'inline-block' }} color={strikethrough && 'secondary'}>
          {strikethrough ? `${(apr * boostMultiplier + lpRewardsApr).toFixed(2)}%` : `${displayApr}%`}
        </Text>
      </Text>
      <Text ml="5px">
        *{t('Base APR (CAKE yield only)')}:{' '}
        {strikethrough ? (
          <Text style={{ display: 'inline-block' }} color="secondary">{`${(apr * boostMultiplier).toFixed(2)}%`}</Text>
        ) : (
          `${apr.toFixed(2)}%`
        )}
      </Text>
      <Text ml="5px">
        *{t('LP Rewards APR')}: {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
      </Text>
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
