import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'

const Wrapper = styled(Flex)<{ background: string }>`
  position: relative;
  border-radius: 32px;
  background: ${({ background }) => background};
  width: 90%;
  max-height: 192px;
  overflow: hidden;
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`

const LeftWrapper = styled(Flex)`
  z-index: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`

const RightWrapper = styled.div`
  img {
    position: absolute;
    height: 100%;
    bottom: 0;
    right: 2rem;
  }
`

const CompetitionTitle = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  font-size: 24px;
  font-weight: 600;
  max-width: 50%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 1.2px;
  -webkit-text-stroke-color: ${({ theme }) => theme.colors.secondary};
  ${({ theme }) => theme.mediaQueries.md} {
    -webkit-text-stroke-width: 2.5px;
    font-size: 42px;
    max-width: 60%;
  }
`

interface FinishedCompetitionBannerProps {
  title: string
  imgSrc: string
  background: string
}

const FinishedCompetitionBanner: React.FC<FinishedCompetitionBannerProps> = ({ title, imgSrc, background }) => {
  return (
    <Wrapper background={background}>
      <LeftWrapper>
        <CompetitionTitle>{title}</CompetitionTitle>
      </LeftWrapper>
      <RightWrapper>
        <img src={imgSrc} alt={title} />
      </RightWrapper>
    </Wrapper>
  )
}

export default FinishedCompetitionBanner
