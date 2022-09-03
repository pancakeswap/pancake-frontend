import { useEffect, useState } from 'react'
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

  const handleMinChange = (newMin: string) => {
    setCurrentMin(newMin ? parseFloat(newMin) : 0)
  }

  const handleMaxChange = (newMax: string) => {
    setCurrentMax(parseFloat(newMax))
  }

  const handleApply = () => {
    onApply(currentMin, currentMax)
  }

  // TODO: circle back to this
  const handleClear = () => {
    setCurrentMax(max)
    setCurrentMin(min)

    if (onClear) {
      onClear()
    }
  }

  // If a change comes down from the top update local state
  useEffect(() => {
    setCurrentMax(max)
  }, [max, setCurrentMax])

  useEffect(() => {
    setCurrentMin(min)
  }, [min, setCurrentMin])

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
          <Grid gap="16px" gridTemplateColumns="repeat(2, 1fr)">
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
