import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  Button,
  Card,
  Flex,
  FlexGap,
  Grid,
  Heading,
  Link,
  LinkExternal,
  PageHeader,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
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
  background: linear-gradient(314deg, rgba(230, 253, 255, 0.5) -24.74%, rgba(243, 240, 255, 0.5) 91.65%),
    linear-gradient(112deg, #f2ecf2 0%, #e8f2f6 100%);

  ${({ theme }) => theme.mediaQueries.lg} {
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const StyledPageHeader = styled(PageHeader)`
  padding-top: 9px;
  padding-bottom: 0px;
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
  const { isDesktop } = useMatchBreakpoints()

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
      <Page style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
        <Box pl={['16px', '16px', '24px']} pr={['16px', '16px', '24px']} mt={['32px', '32px', '32px', '-18px']}>
          <Card innerCardProps={{ padding: isDesktop ? '2em 2em 0 2em' : '1em 1em 0 1em' }}>
            <Grid gridTemplateColumns={isDesktop ? '2fr 3fr' : '1fr'}>
              <FlexGap flexDirection="column" gap="24px">
                <MyVeCakeBalance />
                <CurrentEpoch />
                <Text color="textSubtle" fontSize={12}>
                  {t(
                    'Results are updated weekly. Vote numbers are estimations based on the veCAKE balance at 00:00 UTC on the upcoming Thursday.',
                  )}
                </Text>
              </FlexGap>
              <Box ml={isDesktop ? '60px' : '0'} mt={isDesktop ? '0' : '1em'}>
                <Text color="secondary" textTransform="uppercase" bold>
                  {t('proposed weights')}
                </Text>
                <WeightsPieChart data={gauges} totalGaugesWeight={Number(totalGaugesWeight)} isLoading={isLoading} />
              </Box>
            </Grid>
            {isDesktop ? (
              <GaugesTable
                mt="1.5em"
                data={gauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            ) : (
              <GaugesList
                mt="1.5em"
                data={gauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            )}
          </Card>
          <Box mt="80px">
            <Heading as="h2" scale="xl" mb="24px">
              {t('My votes')}
            </Heading>
            <VoteTable />
          </Box>
        </Box>
      </Page>
    </StyledGaugesVotingPage>
  )
}

export default GaugesVoting
