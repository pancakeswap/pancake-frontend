import React from 'react'
import { Card, CardBody, Flex, Text, Won } from '@pancakeswap/uikit'
import { LotteryTicketClaimData } from 'config/constants/types'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import UnlockButton from 'components/UnlockButton'
import ClaimPrizesInner from './ClaimPrizesInner'

interface UnclaimedRewardsState {
  rewards: LotteryTicketClaimData[]
  isFetchingRewards: boolean
}

interface PrizeCollectionCardProps {
  unclaimedRewards: UnclaimedRewardsState
  onSuccess: () => void
  fetchRewards: () => Promise<void>
}

const PrizeCollectionCard: React.FC<PrizeCollectionCardProps> = ({ unclaimedRewards, onSuccess, fetchRewards }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const getPrizeCollectionContent = () => {
    if (unclaimedRewards.isFetchingRewards) {
      return (
        <>
          <Text mr="24px">{t('Checking tickets')}...</Text>
          <Won width="64px" />
        </>
      )
    }
    if (unclaimedRewards.rewards.length > 0) {
      return (
        <Flex flexDirection="column">
          <ClaimPrizesInner roundsToClaim={unclaimedRewards.rewards} onSuccess={onSuccess} />
        </Flex>
      )
    }
    return (
      <>
        <Text color="textDisabled" mr="24px">
          {t('No prizes to collect')}...
        </Text>
        <Won fill="textDisabled" width="64px" />
      </>
    )
  }

  return (
    <Card mt="24px">
      <CardBody>
        {account ? (
          <Flex justifyContent="space-between" alignItems="center">
            {getPrizeCollectionContent()}
          </Flex>
        ) : (
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Text mb="24px" textAlign="center">
              {t('Connect your wallet to check your tickets')}
            </Text>
            <UnlockButton />
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}

export default PrizeCollectionCard
