import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Text } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useSiwe } from 'hooks/useSiwe'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { Address } from 'viem'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { ClaimButton } from 'views/Quest/components/Reward/ClaimButton'
import { Countdown } from 'views/Quest/components/Reward/Countdown'
import { Questers } from 'views/Quest/components/Reward/Questers'
import { RewardAmount } from 'views/Quest/components/Reward/RewardAmount'
import { Winners } from 'views/Quest/components/Reward/Winners'
import { useAccount } from 'wagmi'

const RewardContainer = styled(Box)`
  width: 100%;
  padding-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 448px;
    min-height: 100vh;
    padding: 40px 40px 168px 40px;
    border-left: 1px solid ${({ theme }) => theme.colors.input};
  }
`

interface RewardProps {
  quest: SingleQuestData
  isTasksCompleted: boolean
  isQuestFinished: boolean
}

export interface GetMerkleProofResponse {
  userId: Address
  questId: string
  proofs: Address[]
  rewardAmount: string
  claimed: boolean
  claimedError: string
  errorMessage: string
  claimTransactionHash: string
}

export const Reward: React.FC<RewardProps> = ({ quest, isTasksCompleted, isQuestFinished }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { fetchWithSiweAuth } = useSiwe()
  const localChainName = chains.find((c) => c.id === quest?.reward?.currency?.network)?.name ?? 'BSC'

  const { data: proofData, refetch: refreshProofData } = useQuery({
    queryKey: ['/get-user-merkle-proof', account, quest.id],
    queryFn: async () => {
      const response = await fetchWithSiweAuth(
        `${GAMIFICATION_PUBLIC_API}/userInfo/v1/users/${account}/quests/${quest.id}/merkle-proof`,
      )
      const result: GetMerkleProofResponse = await response.json()
      return result
    },
    enabled: Boolean(account && quest.id && isTasksCompleted),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const ableToClaimReward = useMemo(
    () =>
      isQuestFinished &&
      isTasksCompleted &&
      proofData?.rewardAmount !== 'null' &&
      Number(proofData?.rewardAmount) > 0 &&
      !proofData?.claimed,
    [proofData, isQuestFinished, isTasksCompleted],
  )

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Flex mb={['24px', '24px', '40px']}>
            <Text fontSize={['24px']} bold>
              {t('Reward')}
            </Text>
            {quest?.reward && (
              <Flex ml="auto" alignSelf="center">
                <Text bold color="text" mr="8px">
                  {localChainName}
                </Text>
                <ChainLogo chainId={quest?.reward?.currency?.network} />
              </Flex>
            )}
          </Flex>
          <Box opacity={!isQuestFinished || ableToClaimReward ? '1' : '0.5'}>
            <RewardAmount reward={quest?.reward} isQuestFinished={isQuestFinished} proofData={proofData ?? null} />
          </Box>
          <Countdown endDateTime={quest?.endDateTime ?? 0} />
          {/* <TotalRewards /> */}
          <Winners totalWinners={Number(quest?.reward?.amountOfWinners)} />
          <Box padding="12px">
            <Questers questId={quest?.id} size={30} fontSize={16} bold />
          </Box>
          <ClaimButton
            quest={quest}
            isTasksCompleted={isTasksCompleted}
            isQuestFinished={isQuestFinished}
            proofData={proofData ?? null}
            ableToClaimReward={ableToClaimReward}
            refreshProofData={refreshProofData}
          />
        </Box>
      </Card>
    </RewardContainer>
  )
}
