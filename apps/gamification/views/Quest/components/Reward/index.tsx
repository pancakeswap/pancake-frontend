import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Text } from '@pancakeswap/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import React from 'react'
import { styled } from 'styled-components'
import { chains } from 'utils/wagmi'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { ClaimButton } from 'views/Quest/components/Reward/ClaimButton'
import { Countdown } from 'views/Quest/components/Reward/Countdown'
import { Questers } from 'views/Quest/components/Reward/Questers'
// import { RemainMessage } from 'views/Quest/components/Reward/RemainMessage'
import { RewardAmount } from 'views/Quest/components/Reward/RewardAmount'
// import { SuccessMessage } from 'views/Quest/components/Reward/SuccessMessage'
// import { TotalRewards } from 'views/Quest/components/Reward/TotalRewards'
// import { Winners } from 'views/Quest/components/Reward/Winners'

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
}

export const Reward: React.FC<RewardProps> = ({ quest }) => {
  const { t } = useTranslation()
  const localChainName = chains.find((c) => c.id === quest?.reward?.currency?.network)?.name ?? 'BSC'

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
          <RewardAmount reward={quest?.reward} />
          <Countdown endDateTime={quest?.endDateTime ?? 0} />
          {/* <TotalRewards /> */}
          <Questers questId={quest?.id} />
          <ClaimButton />
          {/* <RemainMessage /> */}
          {/* <SuccessMessage /> */}
          {/* <Winners /> */}
        </Box>
      </Card>
    </RewardContainer>
  )
}
