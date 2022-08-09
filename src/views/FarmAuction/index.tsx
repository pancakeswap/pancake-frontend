import styled from 'styled-components'
import { Button, Heading, Text, Flex, Link, Breadcrumbs } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from '@pancakeswap/localization'
import { PageMeta } from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import FAQs from './components/FAQs'
import AuctionDetails from './components/AuctionDetailsCard'
import AuctionLeaderboard from './components/AuctionLeaderboard'
import { FORM_ADDRESS } from './helpers'
import { useCurrentFarmAuction } from './hooks/useCurrentFarmAuction'
import AuctionTimer from './components/AuctionTimer'
import ReclaimBidCard from './components/ReclaimBidCard'
import NotWhitelistedNotice from './components/NotWhitelistedNotice'
import CongratulationsCard from './components/CongratulationsCard'
import AuctionCakeBurn from './components/AuctionCakeBurn'

const FAQS_BG_LIGHT = 'linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)'
const FAQ_BG_DARK = 'linear-gradient(180deg, #434575 0%, #66578D 100%)'
const CAKE_BURN_BG_LIGHT = 'radial-gradient(50% 79.31% at 50% 50%, #FAF9FA 0%, #EAECF4 100%)'
const CAKE_BURN_TOP_FILL_LIGHT = 'radial-gradient(ellipse at bottom, #f0f1f6, #EAECF4)'
const CAKE_BURN_BG_DARK = 'radial-gradient(103.12% 50% at 50% 50%, #152534 0%, #191326 100%)'
const CAKE_BURN_TOP_FILL_DARK = '#191326'

const StyledHeader = styled(PageHeader)`
  max-height: max-content;
  margin-bottom: -40px;
  padding-bottom: 40px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
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
  & img {
    height: 50%;
    width: 50%;
    max-height: 330px;
    margin-top: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & img {
      height: auto;
      width: auto;
    }
  }
`

const AuctionContainer = styled(Flex)`
  width: 100%;
  align-items: flex-start;

  ${({ theme }) => theme.mediaQueries.md} {
    gap: 24px;
  }
`

const FarmAuction = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()

  const { currentAuction, bidders, connectedBidder, refreshBidders } = useCurrentFarmAuction(account)

  return (
    <>
      <PageMeta />
      <StyledHeader>
        <Breadcrumbs>
          <NextLink href="/" passHref>
            <Link href="/" color="primary" style={{ fontWeight: 400 }}>
              {t('Home')}
            </Link>
          </NextLink>
          <NextLink href="/farms" passHref>
            <Link href="/farms" color="primary" style={{ fontWeight: 400 }}>
              {t('Farms')}
            </Link>
          </NextLink>
          <Text>{t('Community Farm Auction')}</Text>
        </Breadcrumbs>
        <Flex flexDirection={['column-reverse', null, 'row']}>
          <Left>
            <Heading as="h1" scale="xxl" my="24px">
              {t('Community Farm Auction')}
            </Heading>
            <Text color="textSubtle" mb="24px">
              {t('Each week, qualifying projects can bid CAKE for the right to host a 7-day Farm on PancakeSwap.')}
            </Text>
            <Text color="textSubtle">{t('This page is for projects to bid for farms.')}</Text>
            <Text color="textSubtle" mb="24px">
              {t(
                'If you’re not a whitelisted project, you won’t be able to participate, but you can still view what’s going on!',
              )}
            </Text>
            <Link external href={FORM_ADDRESS}>
              <Button>
                <Text color="white" bold fontSize="16px" mr="4px">
                  {t('Apply for a Farm/Pool')}
                </Text>
              </Button>
            </Link>
          </Left>
          <Right>
            <img src="/images/decorations/auction-bunny.png" alt={t('auction bunny')} />
          </Right>
        </Flex>
      </StyledHeader>
      <>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.background}
          p="24px 0"
          index={2}
          concaveDivider
          dividerPosition="top"
        >
          <NotWhitelistedNotice connectedBidder={connectedBidder} auction={currentAuction} />
          <AuctionTimer auction={currentAuction} />
          <AuctionContainer flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" width="100%" minWidth="288px">
              <AuctionDetails
                auction={currentAuction}
                connectedBidder={connectedBidder}
                refreshBidders={refreshBidders}
              />
              {connectedBidder?.isWhitelisted && bidders && currentAuction && (
                <CongratulationsCard currentAuction={currentAuction} bidders={bidders} />
              )}
              {connectedBidder?.isWhitelisted && <ReclaimBidCard />}
            </Flex>
            <AuctionLeaderboard auction={currentAuction} bidders={bidders} />
          </AuctionContainer>
        </PageSection>
        <PageSection
          background={theme.isDark ? CAKE_BURN_BG_DARK : CAKE_BURN_BG_LIGHT}
          index={2}
          innerProps={{ style: { width: '100%' } }}
          dividerPosition="top"
          dividerFill={{ light: CAKE_BURN_TOP_FILL_LIGHT, dark: CAKE_BURN_TOP_FILL_DARK }}
        >
          <AuctionCakeBurn />
        </PageSection>
        <PageSection
          background={theme.isDark ? FAQ_BG_DARK : FAQS_BG_LIGHT}
          clipFill={{ light: '#CBD7EF', dark: '#434575' }}
          dividerFill={{ light: CAKE_BURN_BG_LIGHT, dark: CAKE_BURN_BG_DARK }}
          concaveDivider
          index={3}
          dividerPosition="top"
        >
          <FAQs />
        </PageSection>
      </>
    </>
  )
}

export default FarmAuction
