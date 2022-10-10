import React from 'react'
import styled from 'styled-components'
import { StaticImageData } from 'next/dist/client/image'
import { Flex, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import Image from 'next/image'

const Wrapper = styled(Flex)<{ background: string }>`
  position: relative;
  border-radius: 32px;
  background: ${({ background }) => background};
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 65%;
  }
  max-height: 192px;
  min-height: 100px;
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
  position: absolute;
  right: 0;
  bottom: -8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: 1px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    right: 0px;
    bottom: 8px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -5px;
  }
`

const CompetitionTitle = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  font-size: 24px;
  font-weight: 600;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 1.2px;
  -webkit-text-stroke-color: ${({ theme }) => theme.colors.secondary};
  ${({ theme }) => theme.mediaQueries.md} {
    -webkit-text-stroke-width: 2.5px;
    font-size: 42px;
  }
`

interface FinishedCompetitionBannerProps {
  title: string
  imgSrc: string | StaticImageData
  background: string
  to: string
}

const FinishedCompetitionBanner: React.FC<React.PropsWithChildren<FinishedCompetitionBannerProps>> = ({
  title,
  imgSrc,
  background,
  to,
}) => {
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Wrapper background={background}>
      <NextLinkFromReactRouter to={to}>
        <Flex justifyContent="space-between">
          <LeftWrapper>
            <CompetitionTitle>{title}</CompetitionTitle>
          </LeftWrapper>
          <RightWrapper>
            {isDesktop ? (
              <Image src={imgSrc} width={300} height={200} />
            ) : (
              <Image className="mobile" src={imgSrc} width={190} height="100%" />
            )}
          </RightWrapper>
        </Flex>
      </NextLinkFromReactRouter>
    </Wrapper>
  )
}

export default FinishedCompetitionBanner
