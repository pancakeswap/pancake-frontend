import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  LinkExternal,
  PageHeader,
  StyledLink,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import NextLink from 'next/link'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { CurrentEpoch } from './components/CurrentEpoch'
import { FilterFieldByType, FilterFieldInput, FilterFieldSort } from './components/GaugesFilter'
import { MyVeCakeBalance } from './components/MyVeCakeBalance'
import { GaugesList, GaugesTable, VoteTable } from './components/Table'
import { WeightsPieChart } from './components/WeightsPieChart'
import { useGauges } from './hooks/useGauges'
import { useGaugesQueryFilter } from './hooks/useGaugesFilter'
import { useGaugesTotalWeight } from './hooks/useGaugesTotalWeight'

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  text-decoration: underline;
  margin-left: 8px;
`

const StyledGaugesVotingPage = styled.div`
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
  const { isDesktop, isMobile, isXl, isXs } = useMatchBreakpoints()
  const { data: gauges, isLoading } = useGauges()
  const { filterGauges, setSearchText, searchText, filter, setFilter, sort, setSort } = useGaugesQueryFilter(gauges)

  return (
    <StyledGaugesVotingPage>
      <StyledPageHeader background="transparent">
        <Flex justifyContent="space-between">
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <NextLink href="/cake-staking">
              <StyledLink color="primary">
                <Button p="0" variant="text">
                  <ArrowBackIcon color="primary" />
                  <Text color="primary" bold fontSize="16px" mr="4px" textTransform="uppercase">
                    {t('cake staking')}
                  </Text>
                </Button>
              </StyledLink>
            </NextLink>
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
                <Box mt={isDesktop ? '40px' : '0'} mb={isDesktop ? '20px' : 0}>
                  <WeightsPieChart
                    data={filterGauges}
                    totalGaugesWeight={Number(totalGaugesWeight)}
                    isLoading={isLoading}
                  />
                </Box>
              </Box>
              {!isMobile && !isXl ? (
                <Grid gridTemplateColumns="1fr 1fr" gridGap="32px">
                  <FilterFieldByType onFilterChange={setFilter} value={filter} />
                  <FilterFieldInput initialValue={searchText} placeholder={t('Search')} onChange={setSearchText} />
                </Grid>
              ) : null}
            </Grid>
            {/* for tablet fit */}
            {isXl ? (
              <Grid gridTemplateColumns="1fr 1fr">
                <FilterFieldByType onFilterChange={setFilter} value={filter} />
                <FilterFieldInput initialValue={searchText} placeholder={t('Search')} onChange={setSearchText} />
              </Grid>
            ) : null}
            {/* for mobile sticky, make it redundancy */}
            {isMobile ? (
              <Grid
                background="background"
                mx={-16}
                p={16}
                gridTemplateColumns="1fr"
                gridGap="1em"
                position="sticky"
                top="0"
              >
                {isXs ? (
                  <FilterFieldByType onFilterChange={setFilter} value={filter} />
                ) : (
                  <Grid gridTemplateColumns="2fr 1fr" gridGap="8px">
                    <FilterFieldByType onFilterChange={setFilter} value={filter} />
                    <FilterFieldSort onChange={setSort} />
                  </Grid>
                )}
                {isXs ? (
                  <Grid gridTemplateColumns="2fr 1fr" gridGap="8px">
                    <FilterFieldInput placeholder={t('Search')} initialValue={searchText} onChange={setSearchText} />
                    <FilterFieldSort onChange={setSort} />
                  </Grid>
                ) : (
                  <FilterFieldInput placeholder={t('Search')} initialValue={searchText} onChange={setSearchText} />
                )}
              </Grid>
            ) : null}
            {isMobile ? (
              <GaugesList
                key={sort}
                data={filterGauges}
                isLoading={isLoading}
                totalGaugesWeight={Number(totalGaugesWeight)}
              />
            ) : (
              <GaugesTable
                mt="1.5em"
                data={filterGauges}
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
