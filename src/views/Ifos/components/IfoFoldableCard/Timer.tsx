import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { getBscScanBlockCountdownUrl } from 'utils/bscscan'
import { Flex, Link, PocketWatchIcon, Text, Skeleton } from '@pancakeswap/uikit'
import getTimePeriods from 'utils/getTimePeriods'
import { PublicIfoData } from 'hooks/ifo/types'

interface Props {
  publicIfoData: PublicIfoData
}

const Timer: React.FC<Props> = ({ publicIfoData }) => {
  const { t } = useTranslation()
  const { status, secondsUntilStart, secondsUntilEnd, startBlockNum } = publicIfoData
  const countdownToUse = status === 'coming_soon' ? secondsUntilStart : secondsUntilEnd
  const timeUntil = getTimePeriods(countdownToUse)
  const suffix = status === 'coming_soon' ? t('Start').toLowerCase() : t('Finish').toLowerCase()
  return (
    <Flex justifyContent="center" mb="32px">
      {status === 'idle' ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <>
          <PocketWatchIcon width="48px" mr="16px" />
          <Flex alignItems="center">
            <Text bold mr="16px">
              {suffix}:
            </Text>
            <Text>
              {t('%day%d %hour%h %minute%m', {
                day: timeUntil.days,
                hour: timeUntil.hours,
                minute: timeUntil.minutes,
              })}
            </Text>
            <Link href={getBscScanBlockCountdownUrl(startBlockNum)} target="blank" rel="noopener noreferrer" ml="8px">
              (blocks)
            </Link>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default Timer
