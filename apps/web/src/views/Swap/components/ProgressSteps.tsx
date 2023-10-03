import { styled } from 'styled-components'
import { AutoColumn } from '@pancakeswap/uikit'
import { RowBetween } from 'components/Layout/Row'

const Grouping = styled(RowBetween)`
  width: 50%;
`

const Circle = styled.div<{ confirmed?: boolean; disabled?: boolean }>`
  min-width: 20px;
  min-height: 20px;
  background-color: ${({ theme, confirmed, disabled }) =>
    disabled ? theme.colors.backgroundDisabled : confirmed ? theme.colors.success : theme.colors.primary};
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 8px;
  font-size: 12px;
`

const CircleRow = styled.div`
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
`

const Connector = styled.div<{ prevConfirmed?: boolean; disabled?: boolean }>`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    ${({ theme, prevConfirmed, disabled }) =>
        disabled ? theme.colors.backgroundDisabled : prevConfirmed ? theme.colors.success : theme.colors.primary}
      0%,
    ${({ theme, prevConfirmed, disabled }) =>
        disabled
          ? theme.colors.backgroundDisabled
          : prevConfirmed
          ? theme.colors.primary
          : theme.colors.backgroundDisabled}
      80%
  );
  opacity: 0.6;
`

interface ProgressCirclesProps {
  steps: boolean[]
  disabled?: boolean
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
export default function ProgressCircles({ steps, disabled = false, ...rest }: ProgressCirclesProps) {
  return (
    <AutoColumn justify="center" {...rest}>
      <Grouping>
        {steps.map((step, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <CircleRow key={i}>
              <Circle confirmed={step} disabled={disabled || (!steps[i - 1] && i !== 0)}>
                {step ? '✓' : i + 1}
              </Circle>
              <Connector prevConfirmed={step} disabled={disabled} />
            </CircleRow>
          )
        })}
        <Circle disabled={disabled || !steps[steps.length - 1]}>{steps.length + 1}</Circle>
      </Grouping>
    </AutoColumn>
  )
}
