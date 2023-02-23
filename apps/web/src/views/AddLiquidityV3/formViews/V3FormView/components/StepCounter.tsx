import { AutoColumn, AutoRow, Button, NumericalInput } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { ReactNode, useCallback, useEffect, useState } from 'react'

interface StepCounterProps {
  value: string
  onUserInput: (value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA: string | undefined
  tokenB: string | undefined
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

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

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
    <AutoColumn gap="8px" width="100%" onFocus={handleOnFocus} onBlur={handleOnBlur}>
      {title}
      <AutoRow>
        {!locked && (
          <Button onClick={handleDecrement} disabled={decrementDisabled}>
            -
          </Button>
        )}

        <NumericalInput
          value={localValue}
          fontSize="20px"
          disabled={locked}
          onUserInput={(val) => {
            setLocalValue(val)
          }}
        />

        {!locked && (
          <Button onClick={handleIncrement} disabled={incrementDisabled}>
            +
          </Button>
        )}
      </AutoRow>
      {tokenB} per {tokenA}
    </AutoColumn>
  )
}

export default StepCounter
