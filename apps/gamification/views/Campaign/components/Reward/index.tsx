import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { ClaimButton } from 'views/Campaign/components/Reward/ClaimButton'
// import { Countdown } from 'views/Quest/components/Reward/Countdown'
// import { Questers } from 'views/Quest/components/Reward/Questers'
// import { RewardAmount } from 'views/Quest/components/Reward/RewardAmount'
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

export const Reward = () => {
  const { t } = useTranslation()

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px', '24px', '40px']}>
            {t('Reward')}
          </Text>
          {/* <RewardAmount /> */}
          {/* <Countdown /> */}
          {/* <Questers /> */}
          <ClaimButton />
        </Box>
      </Card>
    </RewardContainer>
  )
}
