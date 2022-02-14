import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Circle = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
  color: #ffffff;
  font-size: 32px;
  border-radius: 50%;
  margin-bottom: 18px;

  &:before {
    content: '';
    position: absolute;
    top: 24px;
    left: -310px;
    width: 274px;
    height: 1px;
  }
`

const Step = styled.div<{ confirmed?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${Circle} {
    background: ${({ theme, confirmed, disabled }) =>
      disabled
        ? theme.colors.textDisabled
        : confirmed
        ? 'linear-gradient(180deg, #8051D6 0%, #492286 100%)'
        : theme.colors.textSubtle};

    &:before {
      background: ${({ theme, confirmed }) => (confirmed ? theme.colors.secondary : theme.colors.textDisabled)};
    }
  }

  ${Text} {
    color: ${({ theme, confirmed, disabled }) =>
      disabled
        ? theme.colors.textDisabled
        : confirmed
        ? 'linear-gradient(180deg, #8051D6 0%, #492286 100%)'
        : theme.colors.textSubtle};
  }
`

const ProgressWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 635px;
  margin: auto auto 32px auto;

  ${Step} {
    &:first-child {
      ${Circle} {
        &:before {
          display: none;
        }
      }
    }
  }
`

export enum ProgressStepsType {
  STEP1,
  STEP2,
}

interface ProgressCirclesProps {
  step: ProgressStepsType
}

const ProgressSteps: React.FC<ProgressCirclesProps> = ({ step }) => {
  const { t } = useTranslation()
  const isStep1: boolean = step === ProgressStepsType.STEP1

  return (
    <ProgressWrap>
      <Step confirmed={isStep1}>
        <Circle>1</Circle>
        <Text width={260} textAlign="center">
          {t('Unstake LP tokens and CAKE from the old MasterChef contract.')}
        </Text>
      </Step>
      <Step confirmed={!isStep1} disabled={isStep1}>
        <Circle>2</Circle>
        <Text width={228} textAlign="center">
          {t('Stake LP tokens and CAKE to the new MasterChef v2 contract.')}
        </Text>
      </Step>
    </ProgressWrap>
  )
}

export default ProgressSteps
