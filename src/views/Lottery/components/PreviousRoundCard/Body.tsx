import React from 'react'
import styled from 'styled-components'
import { CardBody, Heading, Flex, Skeleton, Text, Box, Button, useModal, CardRibbon } from '@pancakeswap/uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`
  overflow: hidden;
`

const StyedCardRibbon = styled(CardRibbon)`
  right: -40px;
  top: -40px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -20px;
    top: -20px;
  }
`

const PreviousRoundCardBody: React.FC<{ lotteryData: LotteryRound; lotteryId: string }> = ({
  lotteryData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId
  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryData?.status} />,
  )
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)

  return (
    <StyledCardBody>
      <Flex position="relative" flexDirection="column" alignItems="center" justifyContent="center">
        {isLatestRound && <StyedCardRibbon text={t('Latest')} />}

        <Heading mb="24px">{t('Winning Number')}</Heading>
        {lotteryData ? (
          <WinningNumbers number={lotteryData?.finalNumber.toString()} />
        ) : (
          <Skeleton width="240px" height="34px" />
        )}
        {userDataForRound && (
          <>
            <Box mt="32px">
              <Text display="inline">{t('You had')} </Text>
              <Text display="inline" bold>
                {userDataForRound.totalTickets} {t('tickets')}{' '}
              </Text>
              <Text display="inline">{t('this round')}</Text>
            </Box>
            <Button
              onClick={onPresentViewTicketsModal}
              height="auto"
              width="fit-content"
              p="0"
              mb={['32px', null, null, '0']}
              variant="text"
              scale="sm"
            >
              {t('View your tickets')}
            </Button>
          </>
        )}
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
