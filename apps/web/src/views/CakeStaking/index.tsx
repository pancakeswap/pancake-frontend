import { useTranslation } from '@pancakeswap/localization'
import { Grid, Heading, ModalV2, PageHeader, QuestionHelper, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatBigInt, formatNumber } from '@pancakeswap/utils/formatBalance'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import Page from 'components/Layout/Page'
import { useCakeDistributed } from 'hooks/useCakeDistributed'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import styled from 'styled-components'
import { BenefitCard } from './components/BenefitCard'
import { CakeRewardsCard } from './components/CakeRewardsCard'
import { LockCake } from './components/LockCake'
import { PageHead } from './components/PageHead'
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
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { theme } = useTheme()

  return (
    <>
      <ModalV2 isOpen={cakeRewardModalVisible} closeOnOverlayClick onDismiss={() => setCakeRewardModalVisible(false)}>
        <CakeRewardsCard onDismiss={() => setCakeRewardModalVisible(false)} />
      </ModalV2>
      <StyledPageHeader background={isMobile ? theme.colors.gradientInverseBubblegum : undefined}>
        <PageHead />
        <LockCake />
        <Heading scale="xl" color="secondary" mt={['40px', '40px', '45px']} mb={['24px', '24px', '48px']}>
          {t('Benefits of veCAKE')}
        </Heading>
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
      </StyledPageHeader>
      <Page title={t('CAKE Staking')}>
        <Heading scale="xl" mb={['24px', '24px', '48px']} mt={['16px', '16px', 0]}>
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

const StyledPageHeader = styled(PageHeader)`
  padding-top: 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 56px;
  }
`

export default CakeStaking
