import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TokenWithChain } from 'components/TokenWithChain'
import { useFindTokens } from 'hooks/useFindTokens'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

const RewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
`

interface RewardAmountProps {
  reward: undefined | QuestRewardType
}

export const RewardAmount: React.FC<RewardAmountProps> = ({ reward }) => {
  const { t } = useTranslation()
  const token = useFindTokens(reward?.currency?.network as ChainId, reward?.currency?.address as Address)

  return (
    <Box>
      <RewardContainer>
        <Box>
          <Box margin="auto" width="64px">
            <TokenWithChain currency={token} width={64} height={64} />
          </Box>
          <Box m="8px 0 10px 0">
            <Text as="span" bold fontSize="24px" lineHeight="28px">
              {getFullDisplayBalance(new BigNumber(reward?.totalRewardAmount ?? 0), token.decimals, 2)}
            </Text>
            <Text as="span" bold ml="4px" fontSize="20px" lineHeight="24px">
              {token.symbol}
            </Text>
          </Box>
        </Box>
        <Flex>
          <Text style={{ alignSelf: 'center' }} fontSize="14px" color="textSubtle" mr="8px">
            {`${t('Number of Winners:')} ${Number(reward?.amountOfWinners)}`}
          </Text>
        </Flex>
      </RewardContainer>
    </Box>
  )
}
