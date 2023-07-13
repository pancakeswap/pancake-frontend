import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { memo } from 'react'
import { Box, RowBetween, Text } from '@pancakeswap/uikit'
import { BaseAssets, ManagerFee } from '@pancakeswap/position-managers'
import { Currency, Price } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'

export interface VaultInfoProps extends SpaceProps {
  // Total assets of the vault
  vaultAssets?: BaseAssets

  // timestamp of the last time position is updated
  lastUpdatedAt?: number

  // price of the current pool
  price?: Price<Currency, Currency>

  managerFee?: ManagerFee
}

export const VaultInfo = memo(function VaultInfo({ ...props }: VaultInfoProps) {
  const { t } = useTranslation()
  // TODO: mock
  const totalStakedInUsd = 12345679

  return (
    <Box {...props}>
      <RowBetween>
        <Text>{t('Total staked')}:</Text>
        <Text>${totalStakedInUsd}</Text>
      </RowBetween>
    </Box>
  )
})
