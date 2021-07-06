import React from 'react'
import { CardBody, Heading, Flex, Skeleton, Text, Box, Button, useModal } from '@pancakeswap/uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const PreviousRoundCardBody: React.FC<{ lotteryData: LotteryRound; lotteryId: string }> = ({
  lotteryData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryData?.status} />,
  )
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)

  return (
    <CardBody>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
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
    </CardBody>
  )
}

export default PreviousRoundCardBody
