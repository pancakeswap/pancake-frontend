import { useTranslation } from '@pancakeswap/localization'
import { FlexGap, Skeleton, Text, TooltipText } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import React, { forwardRef, MouseEvent, useCallback } from 'react'
import { displayApr } from 'views/universalFarms/utils/displayApr'

type ApyButtonProps = {
  loading?: boolean
  onClick?: () => void
  baseApr?: number
  boostApr?: number
}

export const AprButton = forwardRef<unknown, ApyButtonProps>(({ loading, onClick, baseApr, boostApr }, ref) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (onClick) {
        onClick()
      }
    },
    [onClick],
  )

  if (loading) {
    return <Skeleton height={24} width={80} style={{ borderRadius: '12px' }} />
  }

  return (
    <FarmWidget.FarmApyButton variant="text-and-button" handleClickButton={handleClick}>
      <AprButtonText baseApr={baseApr} boostApr={boostApr} ref={ref} />
    </FarmWidget.FarmApyButton>
  )
})

const AprButtonText: React.FC<Pick<ApyButtonProps, 'baseApr' | 'boostApr'>> = ({ baseApr, boostApr }) => {
  const { t } = useTranslation()
  const isZeroApr = baseApr === 0
  const hasBoost = boostApr && boostApr > 0

  if (typeof baseApr === 'undefined') {
    return null
  }

  if (isZeroApr) {
    return (
      <TooltipText ml="4px" fontSize="16px" color="destructive" bold>
        0%
      </TooltipText>
    )
  }

  if (hasBoost) {
    return (
      <FlexGap ml="4px" mr="5px" gap="4px">
        <Text fontSize="16px" color="success" bold>
          🌿
          {t('Up to')}
        </Text>
        <TooltipText fontSize="16px" color="success" bold decorationColor="secondary">
          {displayApr(boostApr)}
        </TooltipText>
        <TooltipText decorationColor="secondary">
          <Text style={{ textDecoration: 'line-through' }}>{displayApr(baseApr)}</Text>
        </TooltipText>
      </FlexGap>
    )
  }

  return (
    <TooltipText ml="4px" fontSize="16px" color="text">
      {displayApr(baseApr)}
    </TooltipText>
  )
}
