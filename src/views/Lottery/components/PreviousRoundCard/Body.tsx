import styled from 'styled-components'
import {
  CardBody,
  Heading,
  Flex,
  Skeleton,
  Text,
  Box,
  Button,
  useModal,
  CardRibbon,
  useMatchBreakpoints,
  BunnyPlaceholderIcon,
} from '@pancakeswap/uikit'
import { LotteryRound } from 'state/types'
import { useGetUserLotteriesGraphData, useLottery } from 'state/lottery/hooks'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from '../WinningNumbers'
import ViewTicketsModal from '../ViewTicketsModal'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 72px;
    grid-row-gap: 36px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const PreviousRoundCardBody: React.FC<{ lotteryNodeData: LotteryRound; lotteryId: string }> = ({
  lotteryNodeData,
  lotteryId,
}) => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { status },
  } = useLottery()
  const userLotteryData = useGetUserLotteriesGraphData()
  const userDataForRound = userLotteryData.rounds.find((userLotteryRound) => userLotteryRound.lotteryId === lotteryId)
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl

  const currentLotteryIdAsInt = parseInt(currentLotteryId)
  const mostRecentFinishedRoundId =
    status === LotteryStatus.CLAIMABLE ? currentLotteryIdAsInt : currentLotteryIdAsInt - 1
  const isLatestRound = mostRecentFinishedRoundId.toString() === lotteryId

  const [onPresentViewTicketsModal] = useModal(
    <ViewTicketsModal roundId={lotteryId} roundStatus={lotteryNodeData?.status} />,
  )

  const totalTicketNumber = userDataForRound ? userDataForRound.totalTickets : 0
  const ticketRoundText =
    totalTicketNumber > 1
      ? t('You had %amount% tickets this round', { amount: totalTicketNumber })
      : t('You had %amount% ticket this round', { amount: totalTicketNumber })
  const [youHadText, ticketsThisRoundText] = ticketRoundText.split(totalTicketNumber.toString())

  return (
    <StyledCardBody>
      {isLatestRound && <StyledCardRibbon text={t('Latest')} />}
      <Grid>
        <Flex justifyContent={['center', null, null, 'flex-start']}>
          <Heading mb="24px">{t('Winning Number')}</Heading>
        </Flex>
        <Flex maxWidth={['240px', null, null, '100%']} justifyContent={['center', null, null, 'flex-start']}>
          {lotteryId ? (
            lotteryNodeData ? (
              <WinningNumbers
                rotateText={isLargerScreen || false}
                number={lotteryNodeData?.finalNumber.toString()}
                mr={[null, null, null, '32px']}
                size="100%"
                fontSize={isLargerScreen ? '42px' : '16px'}
              />
            ) : (
              <Skeleton
                width={['240px', null, null, '450px']}
                height={['34px', null, null, '71px']}
                mr={[null, null, null, '32px']}
              />
            )
          ) : (
            <>
              <Flex flexDirection="column" alignItems="center" width={['240px', null, null, '480px']}>
                <Text mb="8px">{t('Please specify Round')}</Text>
                <BunnyPlaceholderIcon height="64px" width="64px" />
              </Flex>
            </>
          )}
        </Flex>
        {userDataForRound && (
          <>
            <Box display={['none', null, null, 'flex']}>
              <Heading>{t('Your tickets')}</Heading>
            </Box>
            <Flex
              flexDirection="column"
              mr={[null, null, null, '24px']}
              alignItems={['center', null, null, 'flex-start']}
            >
              <Box mt={['32px', null, null, 0]}>
                <Text display="inline">{youHadText} </Text>
                <Text display="inline" bold>
                  {userDataForRound.totalTickets}
                </Text>
                <Text display="inline">{ticketsThisRoundText}</Text>
              </Box>
              <Button
                onClick={onPresentViewTicketsModal}
                height="auto"
                width="fit-content"
                p="0"
                variant="text"
                scale="sm"
              >
                {t('View your tickets')}
              </Button>
            </Flex>
          </>
        )}
      </Grid>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
