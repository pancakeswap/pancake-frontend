import { useTheme } from '@pancakeswap/hooks'
import { Box, Table, Th, Td, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { RewardBreakdownDetail } from 'views/TradingReward/hooks/useRewardBreakdown'
import PairInfo from 'views/TradingReward/components/PairInfo'

interface RewardsBreakdownDesktopViewProps {
  isFetching: boolean
  list: RewardBreakdownDetail
}

const DesktopView: React.FC<React.PropsWithChildren<RewardsBreakdownDesktopViewProps>> = ({ isFetching, list }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Box maxHeight={1400} overflowY="auto">
      <Table>
        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: theme.card.background }}>
          <tr>
            <Th textAlign={['left']}>{t('Trading Pair')}</Th>
            <Th textAlign={['left']}>{t('Your Volume')}</Th>
            <Th textAlign={['left']}>{t('Your Trading Fee')}</Th>
            <Th textAlign={['right']}>{t('Reward Earned')}</Th>
          </tr>
        </thead>
        <tbody>
          <>
            {isFetching ? (
              <tr>
                <Td colSpan={4} textAlign="center">
                  {t('Loading...')}
                </Td>
              </tr>
            ) : (
              <>
                {list.pairs.length === 0 ? (
                  <tr>
                    <Td colSpan={4} textAlign="center">
                      {t('No results')}
                    </Td>
                  </tr>
                ) : (
                  <>
                    {list.pairs.map((pair) => (
                      <tr key={pair.address}>
                        <Td>
                          <PairInfo
                            chainId={pair.chainId}
                            isReady={!isFetching}
                            lpSymbol={pair.lpSymbol}
                            token={pair.token}
                            quoteToken={pair.quoteToken}
                            feeAmount={pair.feeAmount}
                          />
                        </Td>
                        <Td>
                          <Text color={pair.yourVolume > 0 ? 'text' : 'textSubtle'}>
                            {`$${formatNumber(pair.yourVolume, 0, 2)}`}
                          </Text>
                        </Td>
                        <Td>
                          <Text color={Number(pair.yourTradingFee) > 0 ? 'text' : 'textSubtle'}>
                            {`$${formatNumber(Number(pair.yourTradingFee))}`}
                          </Text>
                        </Td>
                        <Td textAlign="right">
                          <Text color={pair.rewardEarned > 0 ? 'text' : 'textSubtle'}>
                            {`$${formatNumber(pair.rewardEarned)}`}
                          </Text>
                        </Td>
                      </tr>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        </tbody>
      </Table>
    </Box>
  )
}

export default DesktopView
