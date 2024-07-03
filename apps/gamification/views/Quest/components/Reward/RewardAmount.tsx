import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { TokenWithChain } from 'components/TokenWithChain'
import { useTokensByChainWithNativeToken } from 'hooks/useTokensByChainWithNativeToken'
import { useMemo } from 'react'
import { styled } from 'styled-components'
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
  const tokensByChainWithNativeToken = useTokensByChainWithNativeToken(reward?.currency?.network as ChainId)

  const currency = useMemo((): Currency => {
    const findToken = tokensByChainWithNativeToken.find((i) =>
      i.isNative
        ? i.wrapped.address.toLowerCase() === reward?.currency?.address?.toLowerCase()
        : i.address.toLowerCase() === reward?.currency?.address?.toLowerCase(),
    )
    return findToken || (CAKE as any)?.[ChainId.BSC]
  }, [reward, tokensByChainWithNativeToken])

  return (
    <RewardAmountContainer>
      <Flex width="fit-content" margin="auto">
        {reward && (
          <>
            <Box margin="auto" width="64px">
              <TokenWithChain currency={currency} width={64} height={64} />
            </Box>
            <Box ml={['16px']}>
              <Text fontSize={['40px']} bold as="span">
                {Number(reward?.totalRewardAmount).toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
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
