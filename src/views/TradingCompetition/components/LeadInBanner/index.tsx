import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowForwardIcon, Box, Flex, LaurelLeftIcon, LaurelRightIcon } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import PageContainer from 'components/layout/Container'
import allBunniesImageClipped from '../../pngs/all-bunnies-clipped.png'
import { DARKBG, GOLDGRADIENT } from '../Section/sectionStyles'
import { Heading1Text, Heading2Text } from '../CompetitionHeadingText'

const StyledLeadInBanner = styled(Box)`
  background: ${DARKBG};
`

const Container = styled(PageContainer)`
  padding-bottom: 24px;
  padding-top: 24px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.md} {
    background: url(${allBunniesImageClipped}) no-repeat bottom right 24px;
    text-align: left;
  }
`

const Header = styled(Heading1Text)`
  font-size: 24px;
`

const SubHeader = styled(Heading2Text)`
  font-size: 24px;
  margin-bottom: 4px;
`

const LearnMoreLink = styled(Link)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const LaurelWrapper = styled.div`
  flex: none;
  width: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const LeadInBanner = () => {
  const TranslateString = useI18n()

  return (
    <StyledLeadInBanner>
      <Container>
        <Flex alignItems="center" justifyContent={['center', 'center', null, 'start']}>
          <LaurelWrapper>
            <LaurelLeftIcon width="40px" color="warning" />
          </LaurelWrapper>
          <Box px={['8px', '16px', null, '0']}>
            <Header>{TranslateString(999, 'Easter Battle')}</Header>
            <SubHeader background={GOLDGRADIENT} fill>
              {TranslateString(999, '$200,000 in Prizes!')}
            </SubHeader>
            <LearnMoreLink id="hp-learn-more-cta" to="/competition">
              {TranslateString(999, 'Learn More')}
              <ArrowForwardIcon color="primary" ml="4px" />
            </LearnMoreLink>
          </Box>
          <LaurelWrapper>
            <LaurelRightIcon width="40px" color="warning" />
          </LaurelWrapper>
        </Flex>
      </Container>
    </StyledLeadInBanner>
  )
}

export default LeadInBanner
