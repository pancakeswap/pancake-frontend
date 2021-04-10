import React from 'react'
import _uniqueId from 'lodash/uniqueId'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { CountdownProps } from '../../types'
import Step from './Step'

const Spacer = styled.div<{ isPastSpacer?: boolean }>`
  margin: 12px 8px 0 8px;
  width: 28px;
  background-color: ${({ isPastSpacer, theme }) =>
    isPastSpacer ? theme.colors.textSubtle : theme.colors.textDisabled};
  height: 2px;
  border-radius: 4px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 36px;
  }
`

const ProgressStepper: React.FC<CountdownProps> = ({ steps, activeStepIndex }) => {
  const TranslateString = useI18n()
  return (
    <Flex>
      {steps.map((step, index) => {
        const isPastSpacer = index < activeStepIndex
        const stepText = TranslateString(step.translationId, step.text).toUpperCase()

        return (
          <React.Fragment key={_uniqueId('ProgressStep-')}>
            <Step stepText={stepText} index={index} activeStepIndex={activeStepIndex} />
            {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}

export default ProgressStepper
