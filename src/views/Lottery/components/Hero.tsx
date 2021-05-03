import React from 'react'
import styled from 'styled-components'
import { Heading, Text, LinkExternal } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/layout/Container'

const Title = styled(Heading).attrs({ as: 'h1', size: 'xl' })`
  color: #ffffff;
  margin-bottom: 24px;
  text-shadow: 2px 2px 2px #00000040;
`

const ComeBack = styled(Text)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 24px;
  font-weight: 600;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledHero = styled.div`
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: 256px;
  }
`

const StyledContainer = styled(Container)`
  display: flex;

  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const LeftWrapper = styled.div`
  flex: 1;
  padding-right: 0;
  padding-bottom: 40px;
  padding-top: 40px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-right: 32px;
  }
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-left: 0;

  & img {
    width: 80%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0;
    padding-left: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 32px;
    & img {
      margin-top: -25px;
    }
  }
`

const Hero = () => {
  const { t } = useTranslation()

  return (
    <StyledHero>
      <StyledContainer>
        <LeftWrapper>
          <Title>{t('The Lottery Is Changing!')}</Title>
          <ComeBack>{t('Come back soon!')}</ComeBack>
          <LinkExternal
            bold
            mt={20}
            external
            href="https://voting.pancakeswap.finance/#/pancake/proposal/QmU8pcbmBrfbfVQXMMxmkExDq3mYq4s5cbBuFe6uCZzdmX"
          >
            {t('Learn more')}
          </LinkExternal>
        </LeftWrapper>
        <RightWrapper>
          <img src="/images/tombola.png" alt="lottery bunny" />
        </RightWrapper>
      </StyledContainer>
    </StyledHero>
  )
}

export default Hero
