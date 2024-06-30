import { useCallback, useEffect, useState } from 'react'
import { Box, BoxProps, Button, Grid, InlineMenu, TextField } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FilterFooter from '../FilterFooter'

interface MinMaxFilterProps extends BoxProps {
  title?: string
  min?: number
  max: number
  onApply: (min: number, max: number) => void
  onClear?: () => void
}

export const MinMaxFilter: React.FC<React.PropsWithChildren<MinMaxFilterProps>> = ({
  onApply,
  onClear,
  max,
  min = 0,
  ...props
}) => {
  const { t } = useTranslation()
  const [currentMax, setCurrentMax] = useState(max)
  const [currentMin, setCurrentMin] = useState(min)
  const [isError, setIsError] = useState(min > max)

  const handleMinChange = useCallback((newMin: string) => {
    setCurrentMin(newMin ? parseFloat(newMin) : 0)
  }, [])

  const handleMaxChange = useCallback((newMax: string) => {
    setCurrentMax(parseFloat(newMax))
  }, [])

  const handleApply = useCallback(() => {
    onApply(currentMin, currentMax)
  }, [currentMin, currentMax, onApply])

  const handleClear = useCallback(() => {
    setCurrentMax(max)
    setCurrentMin(min)

    if (onClear) {
      onClear()
    }
  }, [max, min, onClear])

  // If a change comes down from the top update local state
  useEffect(() => {
    setCurrentMax(max)
  }, [max])

  useEffect(() => {
    setCurrentMin(min)
  }, [min])

  useEffect(() => {
    setIsError(currentMin > currentMax)
  }, [currentMin, currentMax, setIsError])

  return (
    <InlineMenu
      component={
        <Button variant="light" scale="sm">
          {t('Price')}
        </Button>
      }
      {...props}
    >
      <Box width="320px">
        <Box px="24px" py="16px">
          <Grid gridGap="16px" gridTemplateColumns="repeat(2, 1fr)">
            <TextField label={t('Min')} value={currentMin} onUserInput={handleMinChange} isWarning={isError} />
            <TextField label={t('Max')} value={currentMax} onUserInput={handleMaxChange} isWarning={isError} />
          </Grid>
        </Box>
        <FilterFooter>
          <Button variant="secondary" onClick={handleClear}>
            {t('Clear')}
          </Button>
          <Button onClick={handleApply} disabled={isError}>
            {t('Apply')}
          </Button>
        </FilterFooter>
      </Box>
    </InlineMenu>
  )
}
