import { styled } from 'styled-components'
import { SpaceProps } from 'styled-system'
import { memo, useCallback, useMemo } from 'react'
import { Slider, Box, Flex, Button } from '@pancakeswap/uikit'
import { useDebouncedChangeHandler } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'

interface Props extends SpaceProps {
  percent: number
  onChange?: (percent: number) => void
}

const QuickInputButton = styled(Button).attrs({
  variant: 'tertiary',
  scale: 'sm',
})``

export const PercentSlider = memo(function PercentSlider({ percent, onChange, ...props }: Props) {
  const { t } = useTranslation()
  const [percentForSlider, onPercentSelectForSlider] = useDebouncedChangeHandler(percent, onChange)

  const handleChangePercent = useCallback(
    (value: number) => onPercentSelectForSlider(Math.ceil(value)),
    [onPercentSelectForSlider],
  )
  const sliderLabel = useMemo(() => `${percentForSlider}%`, [percentForSlider])

  return (
    <Box {...props}>
      <Slider
        name="remove-liquidity"
        min={0}
        max={100}
        value={percentForSlider}
        valueLabel={sliderLabel}
        onValueChanged={handleChangePercent}
        mb="16px"
      />
      <Flex flexWrap="wrap" justifyContent="space-evenly">
        <QuickInputButton onClick={() => onChange?.(25)}>25%</QuickInputButton>
        <QuickInputButton onClick={() => onChange?.(50)}>50%</QuickInputButton>
        <QuickInputButton onClick={() => onChange?.(75)}>75%</QuickInputButton>
        <QuickInputButton onClick={() => onChange?.(100)}>{t('Max')}</QuickInputButton>
      </Flex>
    </Box>
  )
})
