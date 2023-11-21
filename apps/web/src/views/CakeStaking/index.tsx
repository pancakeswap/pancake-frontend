import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  ModalV2,
  PageHeader,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { formatBigInt, formatNumber } from '@pancakeswap/utils/formatBalance'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import Page from 'components/Layout/Page'
import { useCakeDistributed } from 'hooks/useCakeDistributed'
import { useState } from 'react'
import { BenefitCard } from './components/BenefitCard'
import { CakeRewardsCard } from './components/CakeRewardsCard'
import { LockCake } from './components/LockCake'
import { NewCakeStakingCard } from './components/NewCakeStakingCard'
import { useGaugesVotingCount } from './hooks/useGaugesVotingCount'
import { useSnapshotVotingCount } from './hooks/useSnapshotVotingCount'
import { useTotalIFOSold } from './hooks/useTotalIFOSold'

const CakeStaking = () => {
  const { t } = useTranslation()
  const gaugesVotingCount = useGaugesVotingCount()
  const snapshotVotingCount = useSnapshotVotingCount()
  const totalCakeDistributed = useCakeDistributed()
  const [cakeRewardModalVisible, setCakeRewardModalVisible] = useState(false)
  const totalIFOSold = useTotalIFOSold()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <>
      <ModalV2 isOpen={cakeRewardModalVisible} closeOnOverlayClick onDismiss={() => setCakeRewardModalVisible(false)}>
        <CakeRewardsCard onDismiss={() => setCakeRewardModalVisible(false)} />
      </ModalV2>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Cake Staking')}
            </Heading>
            <Box maxWidth="537px">
              <Text color="textSubtle">
                {t(
                  'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
                )}
              </Text>
            </Box>
            <NextLinkFromReactRouter
              to="/swap?chain=bsc&inputCurrency=BNB&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
              prefetch={false}
            >
              <Button p="0" variant="text">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Get CAKE')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
            </NextLinkFromReactRouter>
          </Flex>

          <Box>
            <NewCakeStakingCard />
          </Box>
        </Flex>
        <LockCake />
        <Text fontSize="40px" bold color="secondary" lineHeight="110%" mt="45px" mb="48px">
          {t('Benefits of veCAKE')}
        </Text>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard
            type="earnCake"
            dataText={`${formatNumber(Number(formatBigInt(totalCakeDistributed)))} CAKE`}
            onClick={() => {
              setCakeRewardModalVisible(true)
            }}
          />
          <BenefitCard type="gaugesVoting" dataText={`${gaugesVotingCount ?? 0}`} onClick={() => {}} />
        </Grid>
      </PageHeader>
      <Page title={t('Cake staking')}>
        <Heading scale="xl" mb="48px">
          {t('And So Much More...')}
        </Heading>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard type="farmBoost" dataText="3x" />
          <BenefitCard type="snapshotVoting" dataText={`${snapshotVotingCount}`} />
          <BenefitCard type="ifo" dataText={`$${formatAmount(totalIFOSold, { notation: 'standard' })}`} />
          <BenefitCard type="more" />
        </Grid>
      </Page>
    </>
  )
}

export default CakeStaking
