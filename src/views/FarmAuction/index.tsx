import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NavLink } from 'react-router-dom'
import PageHeader from 'components/PageHeader'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import FAQs from './components/FAQs'
import AuctionDetail from './components/AuctionDetail'

const StyledHeader = styled(PageHeader)`
  max-height: max-content;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 352px;
  }
`

const Left = styled(Flex)`
  flex-direction: column;
  flex: 1;
`

const Right = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex: 0.5;

  ${({ theme }) => theme.mediaQueries.lg} {
    & img {
      margin-top: -15%;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    & img {
      margin-top: -25%;
    }
  }
`

const FarmAuction = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const FAQS_BG = 'linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)'

  return (
    <>
      <StyledHeader>
        <Flex>
          <Left>
            <Heading as="h1" scale="xxl" mb="24px">
              {t('Community Farm Auction')}
            </Heading>
            <Text bold fontSize="16px" color="textSubtle" mb="24px">
              {t('Each week, qualifying projects can bid CAKE for the right to host a 7-day Farm on PancakeSwap.')}
            </Text>
            <NavLink exact activeClassName="active" to="/farms/auction" id="lottery-pot-banner">
              <Button>
                <Text color="white" bold fontSize="16px" mr="4px">
                  {t('Apply for a Farm/Pool')}
                </Text>
              </Button>
            </NavLink>
          </Left>
          <Right>
            <img src="/images/decorations/auction-bunny.png" alt="auction bunny" />
          </Right>
        </Flex>
      </StyledHeader>
      <>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.background}
          index={1}
          hasCurvedDivider={false}
        >
          <AuctionDetail />
        </PageSection>
        <PageSection background={FAQS_BG} index={2} hasCurvedDivider={false}>
          <FAQs />
        </PageSection>
      </>
    </>
  )
}

export default FarmAuction
