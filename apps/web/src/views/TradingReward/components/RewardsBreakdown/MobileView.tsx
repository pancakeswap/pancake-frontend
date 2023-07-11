import styled from 'styled-components'
import { Box, Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { RewardBreakdownDetail } from 'views/TradingReward/hooks/useRewardBreakdown'
import PairInfo from 'views/TradingReward/components/PairInfo'

const StyledMobileRow = styled(Box)`
  padding: 24px 0;
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

interface RewardsBreakdownMobileViewProps {
  isFetching: boolean
  list: RewardBreakdownDetail
}

const MobileView: React.FC<React.PropsWithChildren<RewardsBreakdownMobileViewProps>> = ({ isFetching, list }) => {
  const { t } = useTranslation()

  return (
    <Box padding="0 16px">
      {isFetching ? (
        <StyledMobileRow>
          <Text padding="48px 0px" textAlign="center">
            {t('Loading...')}
          </Text>
        </StyledMobileRow>
      ) : (
        <>
          {!list?.pairs || list?.pairs?.length === 0 ? (
            <StyledMobileRow>
              <Text padding="48px 0px" textAlign="center">
                {t('No results')}
              </Text>
            </StyledMobileRow>
          ) : (
            <>
              {list?.pairs?.map((pair) => (
                <StyledMobileRow key={pair.address}>
                  <PairInfo
                    chainId={pair.chainId}
                    isReady={!isFetching}
                    lpSymbol={pair.lpSymbol}
                    token={pair.token}
                    quoteToken={pair.quoteToken}
                    feeAmount={pair.feeAmount}
                  />
                  <Flex justifyContent="space-between" mt="8px">
                    <Text fontSize="14px">{t('Your Volume')}</Text>
                    <Text fontSize="14px" color={pair.yourVolume > 0 ? 'text' : 'textSubtle'}>
                      {`$${formatNumber(pair.yourVolume, 0, 2)}`}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" mt="8px">
                    <Text fontSize="14px">{t('Your Trading Fee')}</Text>
                    <Text fontSize="14px" color={Number(pair.yourTradingFee) > 0 ? 'text' : 'textSubtle'}>
                      {`$${formatNumber(Number(pair.yourTradingFee))}`}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" mt="8px">
                    <Text fontSize="14px">{t('Reward Earned')}</Text>
                    <Text fontSize="14px" bold color={pair.rewardEarned > 0 ? 'text' : 'textSubtle'}>
                      {`$${formatNumber(pair.rewardEarned)}`}
                    </Text>
                  </Flex>
                </StyledMobileRow>
              ))}
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default MobileView
