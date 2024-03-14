import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Skeleton,
  Text,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { LotteryStatus } from 'config/constants/types'
import { useCallback, useState } from 'react'
import { fetchLottery } from 'state/lottery/helpers'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryRound } from 'state/types'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { getDrawnDate, processLotteryResponse } from '../../helpers'
import { WhiteBunny } from '../../svgs'
import BuyTicketsButton from '../BuyTicketsButton'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'
import FinishedRoundTable from './FinishedRoundTable'

interface YourHistoryCardProps {
  handleShowMoreClick: () => void
  numUserRoundsRequested: number
}

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
`

const YourHistoryCard: React.FC<React.PropsWithChildren<YourHistoryCardProps>> = ({
  handleShowMoreClick,
  numUserRoundsRequested,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { address: account } = useAccount()
  const [shouldShowRoundDetail, setShouldShowRoundDetail] = useState(false)
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState<LotteryRound | null>(null)
  const [selectedLotteryId, setSelectedLotteryId] = useState<string | null>(null)

  const {
    isTransitioning,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const handleHistoryRowClick = async (lotteryId: string) => {
    setShouldShowRoundDetail(true)
    setSelectedLotteryId(lotteryId)
    const lotteryData = await fetchLottery(lotteryId)
    const processedLotteryData = processLotteryResponse(lotteryData)
    setSelectedLotteryNodeData(processedLotteryData)
  }

  const clearState = useCallback(() => {
    setShouldShowRoundDetail(false)
    setSelectedLotteryNodeData(null)
    setSelectedLotteryId(null)
  }, [])

  const getHeader = () => {
    if (shouldShowRoundDetail) {
      return (
        <Flex alignItems="center">
          <ArrowBackIcon cursor="pointer" onClick={clearState} mr="20px" />
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Heading scale="md" mb="4px">
              {t('Round')} {selectedLotteryId || ''}
            </Heading>
            {selectedLotteryNodeData?.endTime ? (
              <Text fontSize="14px">
                {t('Drawn')} {getDrawnDate(locale, selectedLotteryNodeData.endTime)}
              </Text>
            ) : (
              <Skeleton width="185px" height="21px" />
            )}
          </Flex>
        </Flex>
      )
    }

    return <Heading scale="md">{t('Rounds')}</Heading>
  }

  const getBody = () => {
    if (shouldShowRoundDetail) {
      return <PreviousRoundCardBody lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedLotteryId} />
    }

    const claimableRounds = userLotteryData?.rounds.filter((round) => {
      return round.status.toLowerCase() === LotteryStatus.CLAIMABLE
    })

    if (!account) {
      return (
        <StyledCardBody>
          <Text textAlign="center" color="textSubtle" mb="16px">
            {t('Connect your wallet to check your history')}
          </Text>
          <ConnectWalletButton />
        </StyledCardBody>
      )
    }
    if (claimableRounds.length === 0) {
      return (
        <StyledCardBody>
          <Box maxWidth="280px">
            <Flex alignItems="center" justifyContent="center" mb="16px">
              <WhiteBunny height="24px" mr="8px" /> <Text textAlign="left">{t('No lottery history found')}</Text>
            </Flex>
            <Text textAlign="center" color="textSubtle" mb="16px">
              {t('Buy tickets for the next round!')}
            </Text>
            <BuyTicketsButton disabled={ticketBuyIsDisabled} width="100%" />
          </Box>
        </StyledCardBody>
      )
    }
    return (
      <FinishedRoundTable
        handleHistoryRowClick={handleHistoryRowClick}
        handleShowMoreClick={handleShowMoreClick}
        numUserRoundsRequested={numUserRoundsRequested}
      />
    )
  }

  const getFooter = () => {
    if (selectedLotteryNodeData) {
      return <PreviousRoundCardFooter lotteryNodeData={selectedLotteryNodeData} lotteryId={selectedLotteryId} />
    }
    return (
      <CardFooter>
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="12px" color="textSubtle">
            {t('Only showing data for Lottery V2')}
          </Text>
        </Flex>
      </CardFooter>
    )
  }

  return (
    <StyledCard>
      <CardHeader>{getHeader()}</CardHeader>
      {getBody()}
      {getFooter()}
    </StyledCard>
  )
}

export default YourHistoryCard
