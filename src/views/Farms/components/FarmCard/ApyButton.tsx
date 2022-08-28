import styled from 'styled-components'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, IconButton, useModal, CalculateIcon, TooltipText, useTooltip, Text } from '@pancakeswap/uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from '@pancakeswap/localization'
import { useFarmUser, useLpTokenPrice } from 'state/farms/hooks'

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
  addLiquidityUrl?: string
  strikethrough?: boolean
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
  addLiquidityUrl,
  strikethrough,
}) => {
  const { t } = useTranslation()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { tokenBalance, stakedBalance } = useFarmUser(pid)
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

  const lpRewardsAPR = useMemo(() => Math.max(Number(displayApr) - apr, 0).toFixed(2), [displayApr, apr])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t(`APR (incl. LP rewards)`)}: {displayApr}%
      </Text>
      <Text ml="5px">
        *{t(`Base APR (CAKE yield only)`)}: {apr.toFixed(2)}%
      </Text>
      <Text ml="5px">
        *{t(`LP Rewards APR`)}: {lpRewardsAPR}%
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <ApyLabelContainer
        alignItems="center"
        onClick={handleClickButton}
        style={strikethrough && { textDecoration: 'line-through' }}
      >
        <>
          <TooltipText ref={targetRef} decorationColor="secondary">
            {displayApr}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </>
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
