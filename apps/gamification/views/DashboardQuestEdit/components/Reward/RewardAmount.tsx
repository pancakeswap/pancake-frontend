import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { CAKE, getTokensByChain } from '@pancakeswap/tokens'
import { ArrowUpIcon, Box, Button, Flex, Input, Text, useModal } from '@pancakeswap/uikit'
import { TokenWithChain } from 'components/TokenWithChain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { AddRewardModal } from 'views/DashboardQuestEdit/components/Reward/AddRewardModal'
import { WithdrawRewardModal } from 'views/DashboardQuestEdit/components/Reward/WithdrawRewardModal'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

const RewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

interface RewardAmountProps {
  reward: undefined | QuestRewardType
  isFinished: boolean
  amountOfWinners: number
  handleInput: (amount: number) => void
  handlePickedRewardToken: (value: Currency, totalRewardAmount: number, amountOfWinnersInModal: number) => void
}

export const RewardAmount: React.FC<RewardAmountProps> = ({
  reward,
  isFinished,
  amountOfWinners,
  handleInput,
  handlePickedRewardToken,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const token = useMemo((): Currency => {
    const list = getTokensByChain(reward?.currency?.network)
    const findToken = list.find((i) => i.address.toLowerCase() === reward?.currency?.address?.toLowerCase())
    return findToken || (CAKE as any)?.[chainId]
  }, [chainId, reward])

  const [onPresentWithdrawRewardModal] = useModal(
    <WithdrawRewardModal token={token} rewardAmount={Number(reward?.totalRewardAmount)} />,
  )

  const [onPresentAddRewardModal] = useModal(
    <AddRewardModal
      reward={reward}
      amountOfWinners={amountOfWinners}
      handlePickedRewardToken={handlePickedRewardToken}
    />,
    true,
    true,
    'add-reward-modal',
  )

  return (
    <Box>
      <RewardContainer>
        <Box style={{ cursor: 'pointer' }} onClick={onPresentAddRewardModal}>
          <Box margin="auto" width="64px">
            <TokenWithChain currency={token} width={64} height={64} />
          </Box>
          <Box m="8px 0 10px 0">
            <Text as="span" bold fontSize="24px" lineHeight="28px">
              {Number(reward?.totalRewardAmount)}
            </Text>
            <Text as="span" bold ml="4px" fontSize="20px" lineHeight="24px">
              {token.symbol}
            </Text>
          </Box>
        </Box>
        {isFinished && (
          <Button
            onClick={onPresentWithdrawRewardModal}
            mb="5px"
            variant="text"
            endIcon={<ArrowUpIcon color="primary" />}
          >
            {t('Withdraw the reward')}
          </Button>
        )}
        <Flex>
          <Text style={{ alignSelf: 'center' }} fontSize="14px" color="textSubtle" mr="8px">
            {t('Amount of winners')}
          </Text>
          <Box width="80px">
            <Input
              pattern="^[0-9]+$"
              inputMode="numeric"
              value={Number(reward?.amountOfWinners)}
              onChange={(e) => handleInput(Number(e.target.value))}
            />
          </Box>
        </Flex>
      </RewardContainer>
    </Box>
  )
}
