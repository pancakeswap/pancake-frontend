import { useEffect, useState, useMemo } from 'react'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { useTheme } from '@pancakeswap/hooks'
import { Box, Card, Table, Th, Td, Text, Flex, PaginationButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { AllTradingRewardPairDetail } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import useRewardBreakdown, { RewardBreakdownDetail } from 'views/TradingReward/hooks/useRewardBreakdown'
import PairInfo from 'views/TradingReward/components/PairInfo'

interface RewardsBreakdownProps {
  latestCampaignId: string
  allUserCampaignInfo: UserCampaignInfoDetail[]
  allTradingRewardPairData: AllTradingRewardPairDetail
  campaignPairs: { [campaignId in string]: { [chainId in string]: Array<string> } }
}

const MAX_PER_PAGE = 1

const initList: RewardBreakdownDetail = {
  campaignId: '',
  campaignStart: 0,
  campaignClaimTime: 0,
  pairs: [],
}

const RewardsBreakdown: React.FC<React.PropsWithChildren<RewardsBreakdownProps>> = ({
  latestCampaignId,
  allUserCampaignInfo,
  allTradingRewardPairData,
  campaignPairs,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { theme } = useTheme()
  const { isDesktop } = useMatchBreakpoints()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [list, setList] = useState<RewardBreakdownDetail>(initList)

  const { data, isFetching } = useRewardBreakdown({
    allUserCampaignInfo,
    allTradingRewardPairData,
    campaignPairs,
  })

  const sortData = useMemo(() => data.sort((a, b) => Number(b.campaignId) - Number(a.campaignId)), [data])

  useEffect(() => {
    if (sortData.length > 0) {
      const max = Math.ceil(sortData?.length / MAX_PER_PAGE)
      setMaxPages(max)
    }

    return () => {
      setMaxPages(1)
      setCurrentPage(1)
      setList(initList)
    }
  }, [sortData])

  useEffect(() => {
    const getActivitySlice = () => {
      const slice = sortData.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setList({ ...slice[0] })
    }
    if (sortData.length > 0) {
      getActivitySlice()
    }
  }, [currentPage, sortData])

  return (
    <Flex
      id="rewards-breakdown"
      flexDirection="column"
      padding="0 16px"
      margin={['0 auto 72px auto', '0 auto 72px auto', '0 auto 72px auto', '0 auto 56px auto']}
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
    >
      <Text lineHeight="110%" textAlign="center" color="secondary" mb="16px" bold fontSize={['40px']}>
        {t('Rewards Breakdown')}
      </Text>
      <Text textAlign="center" color="textSubtle" bold>
        {`${timeFormat(locale, list.campaignStart)} - ${timeFormat(locale, list.campaignClaimTime)}`}
      </Text>
      <Text textAlign="center" color="textSubtle" mb="40px">
        {`${t('Campaign')} ${list.campaignId} ${
          list.campaignId?.toLowerCase() === latestCampaignId?.toLowerCase() ? t('(latest)') : ''
        }`}
      </Text>
      <Card>
        <Box maxHeight={500} overflowY="auto">
          <Table>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: theme.card.background }}>
              <tr>
                <Th textAlign={['left']}>{t('Trading Pair')}</Th>
                {isDesktop ? (
                  <>
                    <Th textAlign={['left']}>{t('Your Volume')}</Th>
                    <Th textAlign={['left']}>{t('Your Trading Fee')}</Th>
                  </>
                ) : (
                  <Th textAlign={['right']}>
                    <Text fontSize="12px" bold color="secondary">
                      {t('YOUR VOL. /')}
                    </Text>
                    <Text fontSize="12px" bold color="secondary">
                      {t('YOUR TRADING FEE')}
                    </Text>
                  </Th>
                )}
                <Th textAlign={['right']}>{t('Reward Earned')}</Th>
              </tr>
            </thead>
            <tbody>
              <>
                {isFetching ? (
                  <tr>
                    <Td colSpan={isDesktop ? 4 : 3} textAlign="center">
                      {t('Loading...')}
                    </Td>
                  </tr>
                ) : (
                  <>
                    {list.pairs.length === 0 ? (
                      <tr>
                        <Td colSpan={isDesktop ? 4 : 3} textAlign="center">
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
                            {isDesktop ? (
                              <>
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
                              </>
                            ) : (
                              <Td>
                                <Text textAlign="right" color={pair.yourVolume > 0 ? 'text' : 'textSubtle'}>
                                  {`$${formatNumber(pair.yourVolume, 0, 2)}`}
                                </Text>
                                <Text textAlign="right" color={Number(pair.yourTradingFee) > 0 ? 'text' : 'textSubtle'}>
                                  {`$${formatNumber(Number(pair.yourTradingFee))}`}
                                </Text>
                              </Td>
                            )}
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
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default RewardsBreakdown
