import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  Flex,
  PaginationButton,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DesktopView from 'views/TradingReward/components/RewardsBreakdown/DesktopView'
import MobileView from 'views/TradingReward/components/RewardsBreakdown/MobileView'
import { AllTradingRewardPairDetail, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useRewardBreakdown, { RewardBreakdownDetail } from 'views/TradingReward/hooks/useRewardBreakdown'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface RewardsBreakdownProps {
  type: RewardType
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
  type,
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
  const [index, setIndex] = useState(0)
  const [list, setList] = useState<RewardBreakdownDetail>(initList)

  const { data, isFetching } = useRewardBreakdown({
    allUserCampaignInfo,
    allTradingRewardPairData,
    campaignPairs,
  })

  const sortData = useMemo(() => data.sort((a, b) => Number(b.campaignId) - Number(a.campaignId)), [data])
  const currentList = useMemo(() => sortData.find((i) => i.campaignClaimTime >= Date.now() / 1000), [sortData])

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

  const sliceData = useCallback(() => {
    const slice = sortData.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
    setList({ ...slice[0] })
  }, [currentPage, sortData])

  useEffect(() => {
    if (sortData.length > 0) {
      sliceData()
    }
  }, [sliceData, sortData])

  const handlePagination = (page: number) => {
    if (!isFetching) {
      setCurrentPage(currentList ? page + 1 : page)
    }
  }

  const handleIndex = (pageIndex: number) => {
    if (pageIndex === 0) {
      setCurrentPage(1)
      if (currentList) {
        setList(currentList)
      }
    } else {
      setCurrentPage(2)
    }
    setIndex(pageIndex)
  }

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
      {currentList && (
        <Box width="350px" margin="auto auto 16px auto">
          <ButtonMenu activeIndex={index} onItemClick={handleIndex} fullWidth scale="sm" variant="subtle">
            <ButtonMenuItem>{t('Current Round')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Previous Rounds')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      )}
      {list?.pairs?.length > 0 && (
        <Text textAlign="center" color="textSubtle" bold>
          {t('Round #%round%  |  %startTime% - %endTime%', {
            round: maxPage - (currentPage - 1),
            startTime: timeFormat(locale, list.campaignStart),
            endTime: timeFormat(locale, list.campaignClaimTime),
          })}
        </Text>
      )}
      {(index === 1 || !currentList) && data.length > 1 ? (
        <Box mb="-16px">
          <PaginationButton
            showMaxPageText
            currentPage={currentList ? currentPage - 1 : currentPage}
            maxPage={currentList ? maxPage - 1 : maxPage}
            setCurrentPage={handlePagination}
          />
        </Box>
      ) : null}
      <Card mt="40px">
        {isDesktop ? (
          <DesktopView type={type} list={list} isFetching={isFetching} />
        ) : (
          <MobileView type={type} list={list} isFetching={isFetching} />
        )}
      </Card>
    </Flex>
  )
}

export default RewardsBreakdown
