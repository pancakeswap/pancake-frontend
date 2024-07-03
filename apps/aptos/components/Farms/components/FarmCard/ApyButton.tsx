import { useBalance } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { RoiCalculatorModal, Text, TooltipText, useModal, useTooltip } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useFarmUserInfoCache } from 'state/farms/hook'
import { FARM_DEFAULT_DECIMALS } from '../../constants'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpAddress: string
  lpSymbol: string
  lpLabel?: string
  multiplier: string
  lpTokenPrice: BigNumber
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  useTooltipText?: boolean
  hideButton?: boolean
  farmCakePerSecond?: string
  totalMultipliers?: string
  dualTokenRewardApr?: number
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel = '',
  lpSymbol,
  lpAddress,
  lpTokenPrice,
  cakePrice = BIG_ZERO,
  apr = 0,
  multiplier,
  displayApr,
  lpRewardsApr,
  addLiquidityUrl = '',
  useTooltipText,
  hideButton,
  farmCakePerSecond,
  totalMultipliers,
  dualTokenRewardApr = 0,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { data: userInfo } = useFarmUserInfoCache(String(pid))
  const { data: tokenBalance = BIG_ZERO } = useBalance({
    watch: true,
    address: account,
    coin: lpAddress,
    select: (d) => new BigNumber(d.value),
  })

  let userBalanceInFarm = BIG_ZERO
  if (userInfo) {
    userBalanceInFarm = new BigNumber(userInfo.amount).plus(tokenBalance)
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('APR (incl. LP rewards)')}: <Text style={{ display: 'inline-block' }}>{`${displayApr}%`}</Text>
      </Text>
      <Text ml="5px">
        {`*${t('Base APR (CAKE yield only)')}: ${apr.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })}%`}
      </Text>
      {dualTokenRewardApr > 0 && (
        <Text ml="5px">
          {`*${t('Base APR (APT yield only)')}: ${dualTokenRewardApr.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })}%`}
        </Text>
      )}
      <Text ml="5px">
        *{t('LP Rewards APR')}: {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  const combineApr = useMemo(() => {
    let total = new BigNumber(apr).plus(lpRewardsApr ?? 0)
    if (dualTokenRewardApr) {
      total = new BigNumber(apr).plus(lpRewardsApr ?? 0).plus(dualTokenRewardApr)
    }

    return total.toNumber()
  }, [apr, dualTokenRewardApr, lpRewardsApr])

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account || ''}
      pid={pid}
      linkLabel={t('Add %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      stakingTokenDecimals={FARM_DEFAULT_DECIMALS}
      earningTokenPrice={cakePrice.toNumber()}
      apr={combineApr}
      lpRewardsApr={lpRewardsApr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm
      rewardCakePerSecond
      farmCakePerSecond={farmCakePerSecond}
      totalMultipliers={totalMultipliers}
      dualTokenRewardApr={dualTokenRewardApr}
    />,
    false,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <FarmWidget.FarmApyButton variant={variant} hideButton={hideButton} handleClickButton={handleClickButton}>
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
