import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Text, Toggle } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { EmptyReward } from 'views/DashboardQuestEdit/components/Reward/EmptyReward'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'
import { StateType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

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
  actionComponent?: JSX.Element
  updateValue: (key: string, value: boolean) => void
}

export const Reward: React.FC<RewardProps> = ({ state, actionComponent, updateValue }) => {
  const { t } = useTranslation()
  const { reward, completionStatus } = state
  const localChainName = chains.find((c) => c.id === reward?.currency?.network)?.name ?? 'BSC'

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Flex mb={['24px']}>
            <Text fontSize={['24px']} bold mr="auto">
              {t('Reward')}
            </Text>
            {completionStatus === CompletionStatus.DRAFTED && !reward?.currency && (
              <Toggle
                scale="md"
                id="toggle-quest-reward"
                checked={state.needAddReward}
                onChange={() => updateValue('needAddReward', !state.needAddReward)}
              />
            )}
          </Flex>
          <BoxContainer>
            {reward?.currency ? (
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
