import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import _uniqueId from 'lodash/uniqueId'
import { Fragment } from 'react'
import { styled } from 'styled-components'
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

const ProgressStepper: React.FC<React.PropsWithChildren<CountdownProps>> = ({ steps, activeStepIndex }) => {
  const { t } = useTranslation()
  return (
    <Flex>
      {steps?.map((step, index) => {
        const isPastSpacer = typeof activeStepIndex !== 'undefined' ? index < activeStepIndex : false
        const stepText = t(step.text)

        return (
          <Fragment key={_uniqueId('ProgressStep-')}>
            <Step stepText={stepText} index={index} activeStepIndex={activeStepIndex} />
            {index + 1 < steps.length && <Spacer isPastSpacer={isPastSpacer} />}
          </Fragment>
        )
      })}
    </Flex>
  )
}

export default ProgressStepper
