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
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const StyledPageHeader = styled(PageHeader)`
  padding-top: 9px;
  padding-bottom: 0px;
`

const GaugesVoting = () => {
  const { t } = useTranslation()
  const totalGaugesWeight = useGaugesTotalWeight()
  const { data: gauges, isLoading } = useGauges()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <StyledGaugesVotingPage>
      <StyledPageHeader background="transparent">
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Link href="/cake-staking">
              <Button p="0" variant="text">
                <ArrowBackIcon color="primary" />
                <Text color="primary" bold fontSize="16px" mr="4px" textTransform="uppercase">
                  {t('cake staking')}
                </Text>
              </Button>
            </Link>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Gauges Voting')}
            </Heading>
            <Box maxWidth="537px">
              <Text color="textSubtle">
                {t('Use veCAKE to vote and determine CAKE emissions.')}
                <InlineLink
                  external
                  showExternalIcon
                  color="textSubtle"
                  href="https://docs.pancakeswap.finance/products/vecake"
                >
                  {t('Learn More')}
                </InlineLink>
              </Text>
            </Box>
          </Flex>

          <Box>
            <img src="/images/gauges-voting/landing-bunny.png" alt="bunny" width="218px" />
          </Box>
        </Flex>
      </StyledPageHeader>
      <Page style={{ paddingTop: 0, marginTop: '-18px' }}>
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
              <WeightsPieChart
                data={gauges}
                totalGaugesWeight={Number(totalGaugesWeight)}
                maxPiesRender={20}
                isLoading={isLoading}
              />
            </Box>
          </Grid>
          {isDesktop ? (
            <GaugesTable mt="1.5em" data={gauges} isLoading={isLoading} totalGaugesWeight={Number(totalGaugesWeight)} />
          ) : (
            <GaugesList mt="1.5em" data={gauges} isLoading={isLoading} totalGaugesWeight={Number(totalGaugesWeight)} />
          )}
        </Card>
        <Box mt="80px">
          <Heading as="h2" scale="xl" mb="24px">
            {t('My votes')}
          </Heading>
          <VoteTable />
        </Box>
      </Page>
    </StyledGaugesVotingPage>
  )
}

export default GaugesVoting
