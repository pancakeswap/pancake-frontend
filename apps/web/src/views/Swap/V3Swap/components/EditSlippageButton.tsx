import { useTheme } from '@pancakeswap/hooks'
import { Button, PencilIcon, RiskAlertIcon, WarningIcon } from '@pancakeswap/uikit'
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

interface EditSlippageButtonProps {
  slippage?: number | ReactElement
}

export const EditSlippageButton = ({ slippage }: EditSlippageButtonProps) => {
  const { theme } = useTheme()
  const color =
    typeof slippage === 'number'
      ? slippage < 50
        ? theme.colors.yellow
        : slippage > 500
        ? theme.colors.failure
        : theme.colors.primary60
      : theme.colors.primary60

  return (
    <GlobalSettings
      mode={SettingsMode.SWAP_LIQUIDITY}
      overrideButton={(onClick) => (
        <TertiaryButton
          $color={color}
          startIcon={
            typeof slippage === 'number' ? (
              slippage < 50 ? (
                <WarningIcon color={color} width={16} />
              ) : slippage > 500 ? (
                <RiskAlertIcon color={color} width={16} />
              ) : undefined
            ) : undefined
          }
          endIcon={<PencilIcon color={color} width={12} />}
          onClick={onClick}
        >
          {typeof slippage === 'number' ? `${basisPointsToPercent(slippage).toFixed(2)}%` : slippage}
        </TertiaryButton>
      )}
    />
  )
}
