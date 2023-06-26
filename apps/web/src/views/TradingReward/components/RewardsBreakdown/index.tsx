import { useEffect, useState, useMemo } from 'react'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Card, Text, Flex, PaginationButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { AllTradingRewardPairDetail } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useRewardBreakdown, { RewardBreakdownDetail } from 'views/TradingReward/hooks/useRewardBreakdown'
import DesktopView from 'views/TradingReward/components/RewardsBreakdown/DesktopView'
import MobileView from 'views/TradingReward/components/RewardsBreakdown/MobileView'

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
        {isDesktop ? (
          <DesktopView list={list} isFetching={isFetching} />
        ) : (
          <MobileView list={list} isFetching={isFetching} />
        )}
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default RewardsBreakdown
