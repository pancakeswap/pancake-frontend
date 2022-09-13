import { useContext } from 'react'

import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, IconButton, useModal, CalculateIcon, TooltipText, useTooltip, Text } from '@pancakeswap/uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from '@pancakeswap/localization'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'
import useBoostMultiplier from '../YieldBooster/hooks/useBoostMultiplier'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
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
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
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
}) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { tokenBalance, stakedBalance } = useFarmUser(pid)
  const { boosterState, proxyAddress } = useContext(YieldBoosterStateContext)
  const boostMultiplier = useBoostMultiplier({ pid, boosterState, proxyAddress })
  const boostMultiplierDisplay = boostMultiplier.toLocaleString(undefined, { maximumFractionDigits: 3 })

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      linkLabel={t('Get %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={stakedBalance.plus(tokenBalance)}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpPrice.toNumber()}
      earningTokenPrice={cakePrice.toNumber()}
      apr={apr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm
    />,
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
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        onClick={(event) => {
          if (hideButton) return
          handleClickButton(event)
        }}
        style={strikethrough && { textDecoration: 'line-through' }}
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
        {variant === 'text-and-button' && (
          <IconButton variant="text" scale="sm" ml="4px">
            <CalculateIcon width="18px" />
          </IconButton>
        )}
      </ApyLabelContainer>
    </Flex>
  )
}

export default ApyButton
