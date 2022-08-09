import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Flex, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { setFinishedRoundInfoFetched, fetchPotteryRoundData } from 'state/pottery/index'
import { usePotteryData } from 'state/pottery/hook'
import RoundSwitcher from 'views/Lottery/components/AllHistoryCard/RoundSwitcher'
import useDebounce from 'hooks/useDebounce'
import { getDrawnDate } from 'views/Lottery/helpers'
import PreviousRoundCardBody from './PreviousRoundCardBody'

const StyledCard = styled(Card)`
  width: 100%;
  margin: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 579px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const AllHistoryCard = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const { publicData, finishedRoundInfo } = usePotteryData()
  const currentPotteryId = publicData.latestRoundId

  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState('')
  const debouncedSelectedRoundId = useDebounce(selectedRoundId, 1000)

  useEffect(() => {
    if (currentPotteryId) {
      const currentPotteryIdAsInt = currentPotteryId ? parseInt(currentPotteryId) : null
      const mostRecentFinishedRoundId = currentPotteryIdAsInt >= 0 ? currentPotteryIdAsInt + 1 : ''
      setLatestRoundId(mostRecentFinishedRoundId)
      setSelectedRoundId(mostRecentFinishedRoundId.toString())
    }
  }, [currentPotteryId])

  useEffect(() => {
    dispatch(setFinishedRoundInfoFetched(false))

    if (debouncedSelectedRoundId && debouncedSelectedRoundId === selectedRoundId) {
      const roundId = parseInt(selectedRoundId) - 1
      dispatch(fetchPotteryRoundData(roundId))
    }
  }, [debouncedSelectedRoundId, selectedRoundId, dispatch])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
    }
  }

  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={false}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
        <Flex mt={['8px', '8px', '8px', '0px']} alignSelf={['flex-start', 'flex-start', 'flex-start', 'center']}>
          {selectedRoundId &&
            finishedRoundInfo.winners &&
            (finishedRoundInfo.isFetched ? (
              finishedRoundInfo.drawDate && (
                <Text fontSize="14px">
                  {t('Drawn')} {getDrawnDate(locale, finishedRoundInfo.drawDate)}
                </Text>
              )
            ) : (
              <Skeleton width="185px" height="21px" />
            ))}
        </Flex>
      </StyledCardHeader>
      {selectedRoundId && finishedRoundInfo.winners ? (
        <PreviousRoundCardBody latestRoundId={latestRoundId} finishedRoundInfo={finishedRoundInfo} />
      ) : (
        <Flex m="24px auto" flexDirection="column" alignItems="center" width="240px">
          <Text mb="8px">{t('Please specify Round')}</Text>
          <BunnyPlaceholderIcon height="64px" width="64px" />
        </Flex>
      )}
    </StyledCard>
  )
}

export default AllHistoryCard
