import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import ProgressStepper from './ProgressStepper'
import { PocketWatch } from '../../svgs'

const Wrapper = styled.div`
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
  border: 1px solid #7645d9;
  box-sizing: border-box;
  border-radius: 0px 0px 24px 24px;
  padding: 16px 24px;
  margin-top: -30px;
  margin-bottom: 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    margin-top: -38px;
    margin-bottom: 0;
    margin-left: 36px;
  }
`

const PocketWatchWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  svg {
    height: 64px;
    width: 64px;
  }
`

const Countdown = () => {
  const TranslateString = useI18n()
  const steps = [
    `${TranslateString(999, 'Entry')}`,
    `${TranslateString(1198, 'Live')}`,
    `${TranslateString(410, 'End')}`,
  ]
  const activeStepIndex = 1

  return (
    <Wrapper>
      <PocketWatchWrapper>
        <PocketWatch />
      </PocketWatchWrapper>
      <Flex flexDirection="column">
        <span>Countdown</span>
        <ProgressStepper steps={steps} activeStepIndex={activeStepIndex} />
      </Flex>
    </Wrapper>
  )
}

export default Countdown
