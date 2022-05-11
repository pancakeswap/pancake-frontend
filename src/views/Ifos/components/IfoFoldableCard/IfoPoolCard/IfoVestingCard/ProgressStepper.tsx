import { Fragment } from 'react'
import _uniqueId from 'lodash/uniqueId'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { CountdownProps } from '../../types'
import Step from './Step'

const Spacer = styled.div<{ isPastSpacer?: boolean }>`
  width: 100%;
  height: 2px;
  border-radius: 4px;
  margin: auto 4px 10px 4px;
  background-color: ${({ isPastSpacer, theme }) =>
    isPastSpacer ? theme.colors.textSubtle : theme.colors.textDisabled};
`

const ProgressStepper: React.FC<CountdownProps> = ({ steps, activeStepIndex }) => {
  const { t } = useTranslation()
  return (
    <Flex>
      {steps.map((step, index) => {
        const isPastSpacer = index < activeStepIndex
        const stepText = t(step.text).toUpperCase()

        return (
          <Fragment key={_uniqueId('Ifo-Vesting-Step-')}>
            <Step index={index} stepText={stepText} activeStepIndex={activeStepIndex} />
            {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
          </Fragment>
        )
      })}
    </Flex>
  )
}

export default ProgressStepper
