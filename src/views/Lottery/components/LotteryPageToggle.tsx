import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`

const ButtonsWrapper = styled.div`
  width: 225px;
  height: 100%;
  border-radius: 16px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.tertiary};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const StyledButton = styled(Button)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const Hero = ({ nextDrawActive, setNextDrawActive }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <ButtonsWrapper>
        <StyledButton
          onClick={() => setNextDrawActive(true)}
          variant={nextDrawActive ? 'primary' : 'tertiary'}
          size="sm"
          style={{ right: '-8px' }}
        >
          {TranslateString(999, 'Next draw')}
        </StyledButton>
        <StyledButton
          onClick={() => setNextDrawActive(false)}
          variant={nextDrawActive ? 'tertiary' : 'primary'}
          size="sm"
          style={{ left: '-8px' }}
        >
          {TranslateString(999, 'Past draws')}
        </StyledButton>
      </ButtonsWrapper>
    </Wrapper>
  )
}

export default Hero
