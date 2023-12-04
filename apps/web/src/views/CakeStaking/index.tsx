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
  QuestionHelper,
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
import { HeadImage } from './components/HeadImage'
import { LockCake } from './components/LockCake'
import { useGaugesVotingCount } from './hooks/useGaugesVotingCount'
import { useSnapshotProposalsCount } from './hooks/useSnapshotProposalsCount'
import { useTotalIFOSold } from './hooks/useTotalIFOSold'

const CakeStaking = () => {
  const { t } = useTranslation()
  const gaugesVotingCount = useGaugesVotingCount()
  const snapshotProposalsCount = useSnapshotProposalsCount()
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
        <Flex pt="24px" justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="16px">
              {t('CAKE Staking')}
            </Heading>
            <Box maxWidth="530px">
              <Text color="textSubtle" lineHeight="120%">
                {t(
                  'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
                )}
              </Text>
            </Box>
            <NextLinkFromReactRouter
              to="/swap?chain=bsc&inputCurrency=BNB&outputCurrency=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
              prefetch={false}
            >
              <Button p="0" variant="text" mt="4px">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Get CAKE')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
            </NextLinkFromReactRouter>
          </Flex>

          <Box>
            <HeadImage />
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
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Claim freshly cooked CAKE rewards weekly on Thursday from veCAKE gauge emission as well as trading revenue sharing.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${formatNumber(Number(formatBigInt(totalCakeDistributed)))} CAKE`}
            onClick={() => {
              setCakeRewardModalVisible(true)
            }}
          />
          <BenefitCard
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veCAKE to vote on your favourite farms, position managers, reward pools, and any CAKE emission products, increase their allocations, and get more CAKE rewards.',
                )}
                placement="top"
                ml="4px"
              />
            }
            type="gaugesVoting"
            dataText={`${gaugesVotingCount ?? 0}`}
            onClick={() => {}}
          />
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
          <BenefitCard
            type="farmBoost"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Boost your PancakeSwap farming APR by up to 2.5x. Aquire more veCAKE to receive a higher boost.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText="2.5x"
          />
          <BenefitCard
            type="snapshotVoting"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use veCAKE as your Snapshot voting power to vote on governance proposals. Including important protocol decisions, and adding new farming gauges.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${snapshotProposalsCount}`}
          />
          <BenefitCard
            type="ifo"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veCAKE as your IFO Public Sales commit credits. Aquire more veCAKE to commit more in the next PancakeSwap IFOs.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`$${formatAmount(totalIFOSold, { notation: 'standard' })}`}
          />
          <BenefitCard type="more" />
        </Grid>
      </Page>
    </>
  )
}

export default CakeStaking
