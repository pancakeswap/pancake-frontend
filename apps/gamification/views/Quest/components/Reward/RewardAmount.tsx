import { ChainId } from '@pancakeswap/sdk'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TokenWithChain } from 'components/TokenWithChain'
import { useFindTokens } from 'hooks/useFindTokens'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { GetMerkleProofResponse } from 'views/Quest/components/Reward'

const RewardAmountContainer = styled(Box)`
  padding-bottom: 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 40px;
  }
`

interface RewardAmountProps {
  reward: undefined | QuestRewardType
  proofData: null | GetMerkleProofResponse
  isQuestFinished: boolean
}

export const RewardAmount: React.FC<RewardAmountProps> = ({ reward, proofData, isQuestFinished }) => {
  const currency = useFindTokens(reward?.currency?.network as ChainId, reward?.currency?.address as Address)

  const amountDisplay = useMemo(() => {
    const balance = getBalanceNumber(new BigNumber(proofData?.rewardAmount ?? 0), currency.decimals)
    return new BigNumber(balance).lt(0.01)
      ? '< 0.01'
      : getFullDisplayBalance(new BigNumber(proofData?.rewardAmount ?? 0), currency.decimals, 2)
  }, [currency, proofData])

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
                {isQuestFinished && Number(proofData?.rewardAmount) > 0 ? (
                  <>{amountDisplay}</>
                ) : (
                  <>{getFullDisplayBalance(new BigNumber(reward?.totalRewardAmount ?? 0), currency.decimals, 2)}</>
                )}
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
