import React from 'react'
import styled from 'styled-components'
import { Text, Progress } from '@pancakeswap-libs/uikit'

const ProgressWrapper = styled.div`
  display: block;
  width: 100%;
`

const TopTextWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const BottomTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const StyledText = styled(Text)`
  margin-right: 16px;
`

const Hero = () => {
  //   const TranslateString = useI18n()

  return (
    <ProgressWrapper>
      <Progress step={10} />
      <TopTextWrapper>
        <StyledText fontSize="20px" bold>
          1h 30m
        </StyledText>
        <Text fontSize="20px" bold color="contrast">
          Until ticket sale
        </Text>
      </TopTextWrapper>
      <BottomTextWrapper>
        <Text>11h 40m until lottery draw</Text>
      </BottomTextWrapper>
    </ProgressWrapper>
  )
}

export default Hero
