import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardHeader, Skeleton, Text } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchLottery } from 'state/lottery/helpers'
import { useLottery } from 'state/lottery/hooks'
import { LotteryRound } from 'state/types'
import { styled } from 'styled-components'
import { getDrawnDate, processLotteryResponse } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'
import RoundSwitcher from './RoundSwitcher'

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const AllHistoryCard = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    currentLotteryId,
    lotteriesData,
    currentRound: { status, isLoading },
  } = useLottery()
  const [latestRoundId, setLatestRoundId] = useState<number | null>(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState<LotteryRound | null>(null)
  const timer = useRef<NodeJS.Timer | null>(null)

  const numRoundsFetched = lotteriesData?.length

  useEffect(() => {
    if (currentLotteryId) {
      const currentLotteryIdAsInt = parseInt(currentLotteryId)
      const mostRecentFinishedRoundId =
        status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentLotteryId, status])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const lotteryData = await fetchLottery(selectedRoundId)
      const processedLotteryData = processLotteryResponse(lotteryData)
      setSelectedLotteryNodeData(processedLotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      if (timer.current) clearInterval(timer.current)
    }, 1000)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [selectedRoundId, currentLotteryId, numRoundsFetched, dispatch])

  const handleInputChange = useCallback(
    (event) => {
      const {
        target: { value },
      } = event
      if (value) {
        setSelectedRoundId(value)
        if (parseInt(value, 10) <= 0) {
          setSelectedRoundId('')
        }
        if (latestRoundId && parseInt(value, 10) >= latestRoundId) {
          setSelectedRoundId(latestRoundId.toString())
        }
      } else {
        setSelectedRoundId('')
      }
    },
    [latestRoundId],
  )

  const handleArrowButtonPress = useCallback((targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }, [])

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={isLoading}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
        <Box mt="8px">
          {selectedRoundId ? (
            selectedLotteryNodeData?.endTime ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )
          ) : null}
        </Box>
      </StyledCardHeader>
      <PreviousRoundCardBody lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
      <PreviousRoundCardFooter lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedRoundId} />
    </StyledCard>
  )
}

export default AllHistoryCard
