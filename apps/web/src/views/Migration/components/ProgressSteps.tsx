import { Box, BoxProps, Text } from '@pancakeswap/uikit'
import React, { ReactNode } from 'react'
import { styled } from 'styled-components'

const Circle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 24px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 16px;
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

const StyledStep = styled.div<{
  confirmed?: boolean
  disabled?: boolean
  canHover?: boolean
  $stepHairStyles: { left: string; width: string }
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 12px;
  &:before {
    content: '';
    position: absolute;
    width: 1px;
    height: calc(100% - 10px);
    top: calc(-100% + 10px);
    left: 11px;
    z-index: 0;
    pointer-events: none;
    background-color: ${({ theme, confirmed }) => (confirmed ? theme.colors.secondary : theme.colors.textDisabled)};
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
      width: ${({ $stepHairStyles }) => $stepHairStyles.width};
      height: 1px;
      left: ${({ $stepHairStyles }) => $stepHairStyles.left};
      top: 24px;
    }
  }
`

const ProgressWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto 24px auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    justify-content: space-between;
  }

  ${StyledStep} {
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

export interface Step {
  stepId: number
  text: ReactNode
  subText?: ReactNode
  canHover?: boolean
}

interface ProgressArrayProps extends Omit<BoxProps, 'onClick'> {
  pickedStep: number
  steps: Step[]
  onClick?: (id: number) => void
  stepHairStyles: {
    width: string
    left: string
  }
}

export const MigrationProgressSteps: React.FC<React.PropsWithChildren<ProgressArrayProps>> = ({
  pickedStep,
  steps,
  onClick,
  stepHairStyles,
  ...boxProps
}) => {
  return (
    <ProgressWrap {...boxProps}>
      {steps.map((step: Step, index: number) => {
        return (
          <>
            <StyledStep
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              $stepHairStyles={stepHairStyles}
              canHover={step.canHover}
              confirmed={step.stepId === pickedStep}
              disabled={step.stepId !== pickedStep && index + 1 > pickedStep}
              onClick={() => onClick?.(step.stepId)}
            >
              <Circle>{index + 1}</Circle>
              <StepText bold maxWidth={['none', null, null, 200]}>
                {step.text}
              </StepText>
            </StyledStep>
          </>
        )
      })}
    </ProgressWrap>
  )
}
