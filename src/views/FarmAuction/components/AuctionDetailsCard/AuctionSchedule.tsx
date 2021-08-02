import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Text, Flex, Box } from '@pancakeswap/uikit'
import { Auction, AuctionStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'

const ScheduleInner = styled(Flex)`
  flex-direction: column;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

interface ScheduleProps {
  auction: Auction
  showForClosedAuction?: boolean
}

export const AuctionSchedule: React.FC<ScheduleProps> = ({ auction }) => {
  const { startBlock, endBlock, auctionDuration, startDate, endDate, status } = auction
  const { t } = useTranslation()

  const noLiveOrPendingAuction = status === AuctionStatus.ToBeAnnounced || status === AuctionStatus.Closed

  return (
    <>
      <Text fontSize="12px" bold color="secondary" textTransform="uppercase" mb="8px">
        {t('Auction Schedule')}
      </Text>
      <ScheduleInner>
        {!noLiveOrPendingAuction && (
          <Flex justifyContent="space-between" mb="8px">
            <Text small color="textSubtle">
              {t('Auction duration')}
            </Text>
            <Text small>{t('%numHours% hours', { numHours: `~${auctionDuration.toString()}` })}</Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" mb="8px">
          <Text small color="textSubtle">
            {t('Start')}
          </Text>
          {noLiveOrPendingAuction ? (
            <Text small>{t('To be announced')}</Text>
          ) : (
            <Box>
              <Text small>{format(startDate, 'MMMM dd yyyy hh:mm aa')}</Text>
              <Text small textAlign="right">
                {t('Block %num%', { num: startBlock })}
              </Text>
            </Box>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text small color="textSubtle">
            {t('End')}
          </Text>
          {noLiveOrPendingAuction ? (
            <Text small>{t('To be announced')}</Text>
          ) : (
            <Box>
              <Text small>{format(endDate, 'MMMM dd yyyy hh:mm aa')}</Text>
              <Text small textAlign="right">
                {t('Block %num%', { num: endBlock })}
              </Text>
            </Box>
          )}
        </Flex>
      </ScheduleInner>
    </>
  )
}

export const FarmSchedule: React.FC<ScheduleProps> = ({ auction, showForClosedAuction }) => {
  const { status, farmStartBlock, farmEndBlock, farmStartDate, farmEndDate } = auction
  const { t } = useTranslation()

  let scheduleToBeAnnounced = status === AuctionStatus.ToBeAnnounced || status === AuctionStatus.Closed
  // Schedule for closed auction is shown in congratulation card but not shown in Next Auction card
  if (showForClosedAuction) {
    scheduleToBeAnnounced = false
  }

  return (
    <Flex flexDirection="column" mt="24px">
      <Text textTransform="uppercase" color="secondary" bold fontSize="12px" mb="8px">
        {t('Farm schedule')}
      </Text>
      <ScheduleInner>
        <Flex justifyContent="space-between" mb="8px">
          <Text small color="textSubtle">
            {t('Farm duration')}
          </Text>
          <Text small>{t('%num% days', { num: 7 })}</Text>
        </Flex>
        <Flex justifyContent="space-between" mb="8px">
          <Text small color="textSubtle">
            {t('Start')}
          </Text>
          {scheduleToBeAnnounced ? (
            <Text small>{t('To be announced')}</Text>
          ) : (
            <Box>
              <Text small>{format(farmStartDate, 'MMMM dd yyyy hh:mm aa')}</Text>
              <Text small textAlign="right">
                {t('Block %num%', { num: farmStartBlock })}
              </Text>
            </Box>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text small color="textSubtle">
            {t('End')}
          </Text>
          {scheduleToBeAnnounced ? (
            <Text small>{t('To be announced')}</Text>
          ) : (
            <Box>
              <Text small>{format(farmEndDate, 'MMMM dd yyyy hh:mm aa')}</Text>
              <Text small textAlign="right">
                {t('Block %num%', { num: farmEndBlock })}
              </Text>
            </Box>
          )}
        </Flex>
      </ScheduleInner>
    </Flex>
  )
}
