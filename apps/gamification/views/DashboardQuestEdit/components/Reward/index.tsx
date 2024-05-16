import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CalenderIcon, Card, Flex, PencilIcon, Text, VolumeIcon } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { AddReward } from 'views/DashboardQuestEdit/components/Reward/AddReward'
import { Countdown } from 'views/DashboardQuestEdit/components/Reward/Countdown'
// import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'

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

interface RewardProps {
  amountPerWinner: string
  updateValue: (key: string, value: string) => void
}

export const Reward: React.FC<RewardProps> = ({ amountPerWinner, updateValue }) => {
  const { t } = useTranslation()
  const isEditPage = false
  const disabled = true

  const handleRewardPerWin = useCallback(
    (value: string) => {
      updateValue('amountPerWinner', value)
    },
    [updateValue],
  )

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px']}>
            {t('Reward')}
          </Text>
          <AddReward />
          {/* <RewardAmount amountPerWinner={amountPerWinner} setAmountPerWinner={handleRewardPerWin} /> */}
          <Countdown />
          <Flex flexDirection="column" mt="30px">
            {isEditPage ? (
              <>
                <Button
                  width="100%"
                  variant="secondary"
                  endIcon={<CalenderIcon color="primary" width={20} height={20} />}
                >
                  {t('Save and schedule')}
                </Button>
                <Button width="100%" mt="8px" endIcon={<PencilIcon color="invertedContrast" width={14} height={14} />}>
                  {t('Save to the drafts')}
                </Button>
              </>
            ) : (
              <Button
                width="100%"
                variant="secondary"
                disabled={disabled}
                endIcon={<VolumeIcon color={disabled ? 'textDisabled' : 'primary'} width={20} height={20} />}
              >
                {t('Fill in the page to publish')}
              </Button>
            )}
          </Flex>
        </Box>
      </Card>
    </RewardContainer>
  )
}
