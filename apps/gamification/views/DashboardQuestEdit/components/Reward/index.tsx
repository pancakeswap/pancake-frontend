import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'

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

export const Reward = () => {
  const { t } = useTranslation()

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px', '24px', '40px']}>
            {t('Reward')}
          </Text>
          <RewardAmount />
          {/* <Countdown /> */}
        </Box>
      </Card>
    </RewardContainer>
  )
}
