import { useTranslation } from '@pancakeswap/localization'
import { bscTokens } from '@pancakeswap/tokens'
import { ArrowUpIcon, Box, Button, Flex, Input, Text, useModal } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { WithdrawRewardModal } from 'views/DashboardQuestEdit/components/Reward/WithdrawRewardModal'

const RewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

interface RewardAmountProps {
  amountPerWinner: string
  setAmountPerWinner: (value: string) => void
}

export const RewardAmount: React.FC<RewardAmountProps> = ({ amountPerWinner, setAmountPerWinner }) => {
  const { t } = useTranslation()
  const token = bscTokens.usdt
  const rewardAmount = 1000

  const [onPresentWithdrawRewardModal] = useModal(<WithdrawRewardModal token={token} rewardAmount={rewardAmount} />)

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setAmountPerWinner(e.target.value)
      }
    },
    [setAmountPerWinner],
  )

  return (
    <Box>
      <RewardContainer>
        <TokenImage token={token} width={64} height={64} />
        <Box m="8px 0 10px 0">
          <Text as="span" bold fontSize="24px" lineHeight="28px">
            {rewardAmount}
          </Text>
          <Text as="span" bold ml="4px" fontSize="20px" lineHeight="24px">
            {token.symbol}
          </Text>
        </Box>
        <Button
          onClick={onPresentWithdrawRewardModal}
          mb="5px"
          variant="text"
          endIcon={<ArrowUpIcon color="primary" />}
        >
          {t('WIthdraw the reward')}
        </Button>
        <Flex>
          <Text style={{ alignSelf: 'center' }} fontSize="14px" color="textSubtle" mr="8px">
            {t('%token% per winner:', { token: token.symbol })}
          </Text>
          <Box width="80px">
            <Input pattern="^[0-9]+$" inputMode="numeric" value={amountPerWinner} onChange={handleInput} />
          </Box>
        </Flex>
      </RewardContainer>
    </Box>
  )
}
