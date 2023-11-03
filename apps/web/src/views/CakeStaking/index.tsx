import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  ModalV2,
  NextLinkFromReactRouter,
  PageHeader,
  Text,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import Page from 'components/Layout/Page'
import { getTotalIFOSold } from 'config/constants/ifo'
import { useState } from 'react'
import { BenefitCard } from './components/BenefitCard'
import { CakeRewardsCard } from './components/CakeRewardsCard'
import { NewCakeStakingCard } from './components/NewCakeStakingCard'
import { useGaugesVotingCount } from './hooks/useGaugesVotingCount'
import { useSnapshotVotingCount } from './hooks/useSnapshotVotingCount'
import { LockCake } from './components/LockCake'

const totalIFOSold = getTotalIFOSold()

const CakeStaking = () => {
  const { t } = useTranslation()
  const gaugesVotingCount = useGaugesVotingCount()
  const snapshotVotingCount = useSnapshotVotingCount()
  const [cakeRewardModalVisible, setCakeRewardModalVisible] = useState(false)

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
            {/* @todo: @ChefJerry add link */}
            <NextLinkFromReactRouter to="/tbd" prefetch={false}>
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
        <Grid maxWidth="820px" gridGap="24px" gridTemplateColumns="repeat(2, 1fr)" alignItems="center" mx="auto">
          <BenefitCard
            type="earnCake"
            dataText="123,456,789 CAKE"
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
        <Grid maxWidth="820px" gridGap="24px" gridTemplateColumns="repeat(2, 1fr)" alignItems="center" mx="auto">
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
