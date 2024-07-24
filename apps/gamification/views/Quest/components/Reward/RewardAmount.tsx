import { ChainId } from '@pancakeswap/sdk'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TokenWithChain } from 'components/TokenWithChain'
import { useFindTokens } from 'hooks/useFindTokens'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'

const RewardAmountContainer = styled(Box)`
  padding-bottom: 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 40px;
  }
`

interface RewardAmountProps {
  reward: undefined | QuestRewardType
}

export const RewardAmount: React.FC<RewardAmountProps> = ({ reward }) => {
  const currency = useFindTokens(reward?.currency?.network as ChainId, reward?.currency?.address as Address)

  return (
    <RewardAmountContainer>
      <Flex width="fit-content" margin="auto">
        {reward?.currency && (
          <>
            <Box margin="auto" width="64px">
              <TokenWithChain currency={currency} width={64} height={64} />
            </Box>
            <Box ml={['16px']}>
              <Text fontSize={['40px']} bold as="span">
                {getFullDisplayBalance(new BigNumber(reward?.totalRewardAmount ?? 0), currency.decimals, 2)}
              </Text>
              <Text textTransform="uppercase" fontSize={['24px']} bold as="span" ml="4px">
                {currency.symbol}
              </Text>
            </Box>
          </>
        )}
      </Flex>
    </RewardAmountContainer>
  )
}
