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
    <Box>
      <Table width="100%">
        <thead style={{ background: theme.card.background }}>
          <tr style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
            <Th width="40%" textAlign={['left']}>
              {t('Trading Pair')}
            </Th>
            <Th width="20%" textAlign={['left']}>
              {t('Your Volume')}
            </Th>
            <Th width="20%" textAlign={['left']}>
              {t('Your Trading Fee')}
            </Th>
            <Th width="20%" textAlign={['right']}>
              {t('Reward Earned')}
            </Th>
          </tr>
        </thead>
        <tbody style={{ display: 'block', overflowY: 'auto', maxHeight: '1250px' }}>
          <>
            {isFetching ? (
              <tr style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                <Td colSpan={4} textAlign="center">
                  {t('Loading...')}
                </Td>
              </tr>
            ) : (
              <>
                {!list?.pairs || list?.pairs?.length === 0 ? (
                  <tr style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                    <Td colSpan={4} textAlign="center">
                      {t('No results')}
                    </Td>
                  </tr>
                ) : (
                  <>
                    {list?.pairs?.map((pair) => (
                      <tr key={pair.address} style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
                        <Td width="40%">
                          <PairInfo
                            chainId={pair.chainId}
                            isReady={!isFetching}
                            lpSymbol={pair.lpSymbol}
                            token={pair.token}
                            quoteToken={pair.quoteToken}
                            feeAmount={pair.feeAmount}
                          />
                        </Td>
                        <Td width="20%">
                          <Text color={pair.yourVolume > 0 ? 'text' : 'textSubtle'}>
                            {`$${formatNumber(pair.yourVolume, 0, 2)}`}
                          </Text>
                        </Td>
                        <Td width="20%">
                          <Text color={Number(pair.yourTradingFee) > 0 ? 'text' : 'textSubtle'}>
                            {`$${formatNumber(Number(pair.yourTradingFee))}`}
                          </Text>
                        </Td>
                        <Td textAlign="right" width="20%">
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
