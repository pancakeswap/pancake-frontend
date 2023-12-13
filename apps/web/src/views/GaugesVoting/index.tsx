import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Link,
  LinkExternal,
  PageHeader,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { CurrentEpoch } from './components/CurrentEpoch'
import { MyVeCakeBalance } from './components/MyVeCakeBalance'
import { GaugesList, GaugesTable, VoteTable } from './components/Table'
import { WeightsPieChart } from './components/WeightsPieChart'
import { useGauges } from './hooks/useGauges'
import { useGaugesTotalWeight } from './hooks/useGaugesTotalWeight'

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  text-decoration: underline;
  margin-left: 8px;
`

const StyledGaugesVotingPage = styled.div`
  overflow: hidden;
  background: transparent;

  ${({ theme }) => theme.mediaQueries.lg} {
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const StyledPageHeader = styled(PageHeader)`
  padding-top: 9px;
  padding-bottom: 33px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: 0px;
  }
`

const StyledPage = styled(Page)`
  padding: 0px;

  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.md} {
    background: transparent;
  }
`

const BunnyImage = styled.img`
  /* width: 218px; */
  width: 180px;
  position: absolute;
  right: -30px;
  top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 218px;
    position: static;
  }
`

const GaugesVoting = () => {
  const { t } = useTranslation()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { data: gauges, isLoading } = useGauges()
  const { isDesktop, isMobile } = useMatchBreakpoints()

  return (
    <StyledGaugesVotingPage>
      <StyledPageHeader background="transparent">
        <Flex justifyContent="space-between">
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Link href="/cake-staking">
              <Button p="0" variant="text">
                <ArrowBackIcon color="primary" />
                <Text color="primary" bold fontSize="16px" mr="4px" textTransform="uppercase">
                  {t('cake staking')}
                </Text>
              </Button>
            </Link>
            <Text lineHeight="110%" bold color="secondary" mb="16px" fontSize={['32px', '32px', '64px', '64px']}>
              {t('Gauges Voting')}
            </Text>
            <Box maxWidth={['200px', '200px', '537px']}>
              <Flex flexDirection={['column', 'column', 'row']}>
                <Text color="textSubtle" maxWidth={['142px', '100%', '100%']}>
                  {t('Use veCAKE to vote and determine CAKE emissions.')}
                </Text>
                <Box ml={['-8px', '-8px', 0]}>
                  <InlineLink
                    external
                    showExternalIcon
                    color="textSubtle"
                    href="https://docs.pancakeswap.finance/products/vecake"
                  >
                    {t('Learn More')}
                  </InlineLink>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex justifyContent="flex-end">
            <BunnyImage src="/images/gauges-voting/landing-bunny.png" alt="bunny" />
          </Flex>
        </Flex>
      </StyledPageHeader>
      <StyledPage>
        <Box
          pl={['16px', '16px', '24px']}
          pr={['16px', '16px', '24px']}
          mt={['32px', '32px', '32px', '-18px']}
          pb={['32px', '32px', '52px']}
        >
          <ResponsiveCard>
            <Grid gridTemplateColumns={isDesktop ? '2.2fr 3fr' : '1fr'}>
              <EpochPreview />
              <Box ml={isDesktop ? '60px' : '0'} mt={isDesktop ? '0' : '1em'}>
                <Text color="secondary" textTransform="uppercase" bold>
                  {t('proposed weights')}
                </Text>
                <WeightsPieChart data={gauges} totalGaugesWeight={Number(totalGaugesWeight)} isLoading={isLoading} />
              </Box>
            </Grid>
            {isMobile ? (
              <GaugesList
                mt="1.5em"
                data={gauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            ) : (
              <GaugesTable
                mt="1.5em"
                data={gauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            )}
          </ResponsiveCard>
          <Box mt="80px">
            <Heading as="h2" scale="xl" mb="24px">
              {t('My votes')}
            </Heading>
            <VoteTable />
          </Box>
        </Box>
      </StyledPage>
    </StyledGaugesVotingPage>
  )
}

const EpochPreview = () => {
  return (
    <Card isActive style={{ height: 'fit-content' }}>
      <MyVeCakeBalance />
      <CurrentEpoch />
    </Card>
  )
}

const ResponsiveCard: React.FC<PropsWithChildren> = ({ children }) => {
  const { isDesktop } = useMatchBreakpoints()
  if (isDesktop) {
    return <Card innerCardProps={{ padding: '2em 2em 0 2em' }}>{children}</Card>
  }
  return <Box pt="2em">{children}</Box>
}

export default GaugesVoting
