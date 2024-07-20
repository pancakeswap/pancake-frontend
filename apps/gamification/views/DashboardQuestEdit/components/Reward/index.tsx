import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Card, Flex, Text, Toggle } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useState } from 'react'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { EmptyReward } from 'views/DashboardQuestEdit/components/Reward/EmptyReward'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'
import { QuestRewardType, StateType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus, RewardType } from 'views/DashboardQuestEdit/type'

const RewardContainer = styled(Box)`
  width: 100%;
  padding-bottom: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 448px;
    min-height: 100vh;
    padding: 40px 40px 168px 40px;
    border-left: 1px solid ${({ theme }) => theme.colors.input};
  }
`

const BoxContainer = styled(Flex)`
  flex-direction: column;
  padding-bottom: 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

interface RewardProps {
  state: StateType
  hasTask: boolean
  actionComponent?: JSX.Element
  updateValue: (key: string, value: string | QuestRewardType) => void
}

export const Reward: React.FC<RewardProps> = ({ state, hasTask, actionComponent, updateValue }) => {
  const { t } = useTranslation()
  const { reward, completionStatus } = state
  const [needReward, setNeedReward] = useState(true)

  const handlePickedRewardToken = (currency: Currency, totalRewardAmount: number, amountOfWinners: number) => {
    const tokenAddress = currency?.isNative ? currency?.wrapped?.address : currency?.address
    const tokenChainId = currency?.chainId

    let rewardData: QuestRewardType = {
      title: '',
      description: '',
      rewardType: RewardType.TOKEN,
      currency: {
        address: tokenAddress,
        network: tokenChainId,
      },
      amountOfWinners,
      totalRewardAmount,
    }

    if (reward) {
      rewardData = {
        ...reward,
        totalRewardAmount,
        amountOfWinners,
        currency: {
          address: tokenAddress,
          network: tokenChainId,
        },
      }
    }

    updateValue('reward', rewardData)
  }

  const localChainName = chains.find((c) => c.id === reward?.currency?.network)?.name ?? 'BSC'

  // const { toastError } = useToast()
  // const [onPresentAddRewardModal] = useModal(
  //   <AddRewardModal state={state} handlePickedRewardToken={handlePickedRewardToken} />,
  //   true,
  //   true,
  //   'add-reward-modal',
  // )

  // const endDateTime = state.endDate && state.endTime ? combineDateAndTime(state.endDate, state.endTime) ?? 0 : 0

  // const onClickAddReward = () => {
  //   if (!state.id) {
  //     toastError(t('Only available for Draft status'))
  //   } else if (endDateTime <= 0) {
  //     toastError(t('Please setup end time'))
  //   } else if (!hasTask) {
  //     toastError(t('Please create at least 1 task'))
  //   } else {
  //     onPresentAddRewardModal()
  //   }
  // }

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Flex mb={['24px']}>
            <Text fontSize={['24px']} bold mr="auto">
              {t('Reward')}
            </Text>
            {completionStatus === CompletionStatus.DRAFTED && !reward && (
              <Toggle
                scale="md"
                id="toggle-quest-reward"
                checked={needReward}
                onChange={() => setNeedReward(!needReward)}
              />
            )}
          </Flex>
          <BoxContainer>
            {reward ? (
              <>
                <RewardAmount reward={reward} />
                {reward?.currency?.network && (
                  <Flex justifyContent="center">
                    <ChainLogo chainId={reward?.currency?.network} />
                    <Text bold color="text" ml="8px">
                      {localChainName}
                    </Text>
                  </Flex>
                )}
              </>
            ) : (
              <EmptyReward />
            )}
          </BoxContainer>
          {actionComponent}
        </Box>
      </Card>
    </RewardContainer>
  )
}
