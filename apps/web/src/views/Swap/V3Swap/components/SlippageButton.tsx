import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Button, PencilIcon, RiskAlertIcon, useMatchBreakpoints, useTooltip, WarningIcon } from '@pancakeswap/uikit'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { ReactElement } from 'react'
import styled from 'styled-components'
import { basisPointsToPercent } from 'utils/exchange'

const TertiaryButton = styled(Button).attrs({ variant: 'tertiary' })<{ $color: string }>`
  height: unset;
  padding: 7px 8px;
  font-size: 14px;
  border-radius: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  color: ${({ $color }) => $color};
`

interface SlippageButtonProps {
  slippage?: number | ReactElement
}

export const SlippageButton = ({ slippage }: SlippageButtonProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const isRiskyLow = typeof slippage === 'number' && slippage < 50
  const isRiskyHigh = typeof slippage === 'number' && slippage > 100
  const isRiskyVeryHigh = typeof slippage === 'number' && slippage > 2000

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isRiskyLow
      ? t('Your transaction may fail. Reset settings to avoid potential loss')
      : isRiskyHigh
      ? t('Your transaction may be frontrun. Reset settings to avoid potential loss')
      : '',
    { placement: 'top' },
  )

  const color = isRiskyVeryHigh
    ? theme.colors.failure
    : isRiskyLow || isRiskyHigh
    ? theme.colors.yellow
    : theme.colors.primary60

  return (
    <>
      <GlobalSettings
        id="slippage_btn_global_settings"
        key="slippage_btn_global_settings"
        mode={SettingsMode.SWAP_LIQUIDITY}
        overrideButton={(onClick) => (
          <>
            <div ref={!isMobile ? targetRef : undefined}>
              <TertiaryButton
                $color={color}
                startIcon={
                  isRiskyVeryHigh ? (
                    <RiskAlertIcon color={color} width={16} />
                  ) : isRiskyLow || isRiskyHigh ? (
                    <WarningIcon color={color} width={16} />
                  ) : undefined
                }
                endIcon={<PencilIcon color={color} width={12} />}
                onClick={onClick}
              >
                {typeof slippage === 'number' ? `${basisPointsToPercent(slippage).toFixed(2)}%` : slippage}
              </TertiaryButton>
            </div>
            {(isRiskyLow || isRiskyHigh) && tooltipVisible && tooltip}
          </>
        )}
      />
    </>
  )
}
