import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'

const Circle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 32px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 21px;
  color: #ffffff;
  border-radius: 50%;
  background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 48px;
    min-width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 32px;
  }
`

const Step = styled.div<{ confirmed?: boolean; disabled?: boolean; canHover?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 28px;
  &:before {
    content: '';
    position: absolute;
    width: 1px;
    height: calc(100% - 16px);
    top: calc(-100% + 10px);
    left: 16px;
    z-index: 0;
    pointer-events: none;
    border: solid 1px;
    border-color: ${({ theme, confirmed }) => (confirmed ? theme.colors.secondary : theme.colors.textDisabled)};
  }

  &:hover {
    cursor: ${({ canHover }) => (canHover ? 'pointer' : 'initial')};
    ${Circle} {
      opacity: ${({ canHover }) => (canHover ? 0.65 : null)};
    }
    ${Text} {
      opacity: ${({ canHover }) => (canHover ? 0.65 : null)};
    }
  }

  &:active {
    ${Circle} {
      opacity: ${({ canHover }) => (canHover ? 0.85 : null)};
    }
    ${Text} {
      opacity: ${({ canHover }) => (canHover ? 0.85 : null)};
    }
  }

  ${Circle} {
    background: ${({ theme, confirmed, disabled }) =>
      disabled
        ? theme.colors.textDisabled
        : confirmed
        ? 'linear-gradient(180deg, #8051D6 0%, #492286 100%)'
        : theme.colors.textSubtle};
  }

  ${Text} {
    color: ${({ theme, confirmed, disabled }) =>
      disabled ? theme.colors.textDisabled : confirmed ? theme.colors.secondary : theme.colors.textSubtle};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    align-items: center;
    margin-top: 0;

    &:before {
      width: 100%;
      height: 1px;
      left: calc(-100% + 48px);
      top: 24px;
    }
  }
`

const ProgressWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto 24px auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 653px;
    flex-direction: row;
    justify-content: space-between;
  }

  ${Step} {
    &:first-child {
      margin-top: 0;
      &:before {
        display: none;
      }
    }
  }
`

const StepText = styled(Text)`
  width: 100%;
  text-align: left;
  margin-left: 24px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 250px;
    text-align: center;
    margin: 19px 0 0 0;
  }
`

export enum ProgressStepsType {
  'STEP1' = 1,
  'STEP2' = 2,
}

export interface Step {
  stepId: ProgressStepsType
  text: string
  canHover?: boolean
}

interface ProgressArrayProps {
  pickedStep: ProgressStepsType
  steps: Step[]
  onClick?: (id: ProgressStepsType) => void
}

const ProgressSteps: React.FC<ProgressArrayProps> = ({ pickedStep, steps, onClick }) => {
  return (
    <ProgressWrap>
      {steps.map((step: Step, index: number) => {
        return (
          <Step
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            canHover={step.canHover}
            confirmed={step.stepId === pickedStep}
            disabled={step.stepId !== pickedStep && index + 1 > pickedStep}
            onClick={() => onClick(step.stepId)}
          >
            <Circle>{index + 1}</Circle>
            <StepText bold>{step.text}</StepText>
          </Step>
        )
      })}
    </ProgressWrap>
  )
}

export default ProgressSteps
