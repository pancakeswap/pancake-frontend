import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/swap-sdk-core'
import { AddCircleIcon, AutoColumn, AutoRow, IconButton, RemoveIcon } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import { LightGreyCard } from 'components/Card'
import { tryParsePrice } from 'hooks/v3/utils'
import { ReactNode, useCallback, useEffect, useState } from 'react'

interface StepCounterProps {
  value: string
  onUserInput: (value: Price<Token, Token> | undefined) => void
  decrement: () => Price<Token, Token> | undefined
  increment: () => Price<Token, Token> | undefined
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA: Currency | undefined | null
  tokenB: Currency | undefined | null
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  // width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  const { t } = useTranslation()
  //  for focus state, styled components doesnt let you select input parent container
  const [, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  // const [

  //   pulsing,
  //   setPulsing,
  // ] = useState<boolean>(false)

  const handleOnFocus = useCallback(() => {
    setUseLocalValue(true)
    setActive(true)
  }, [])

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(tryParsePrice(tokenA?.wrapped, tokenB?.wrapped, localValue)) // trigger update on parent value
  }, [tokenA, tokenB, localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        // setPulsing(true) // trigger animation
        // setTimeout(() => {
        //   setPulsing(false)
        // }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <LightGreyCard padding="0">
      <AutoColumn py="16px" textAlign="center" gap="8px" width="100%" onFocus={handleOnFocus} onBlur={handleOnBlur}>
        {title}
        <AutoRow>
          {!locked && (
            <IconButton
              onClick={handleDecrement}
              disabled={decrementDisabled}
              scale="xs"
              variant="text"
              style={{ width: 20, padding: 16 }}
            >
              <RemoveIcon color="primary" width={20} height={20} />
            </IconButton>
          )}

          <NumericalInput
            value={localValue}
            fontSize="20px"
            align="center"
            disabled={locked}
            onUserInput={setLocalValue}
          />

          {!locked && (
            <IconButton
              px="16px"
              onClick={handleIncrement}
              disabled={incrementDisabled}
              scale="xs"
              variant="text"
              style={{ width: 20, padding: 16 }}
            >
              <AddCircleIcon color="primary" width={20} height={20} />
            </IconButton>
          )}
        </AutoRow>
        {tokenA && tokenB && t('%assetA% per %assetB%', { assetA: tokenB?.symbol, assetB: tokenA?.symbol })}
      </AutoColumn>
    </LightGreyCard>
  )
}

export default StepCounter
