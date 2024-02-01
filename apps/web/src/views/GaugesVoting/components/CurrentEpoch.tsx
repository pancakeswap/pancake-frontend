import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Balance, Box, ErrorIcon, FlexGap, Text, TooltipText, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  formatNumber,
  getBalanceNumber,
  getDecimalAmount,
  getFullDisplayBalance,
} from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCurrentEpochEnd, useEpochOnTally, useNextEpochStart } from '../hooks/useEpochTime'
import { useGaugesTotalWeight } from '../hooks/useGaugesTotalWeight'

dayjs.extend(relativeTime)

export const CurrentEpoch = () => {
  const { t } = useTranslation()
  const totalWeight = useGaugesTotalWeight()
  // const weeklyRewards = useEpochRewards()
  const weeklyRewards = getDecimalAmount(new BN(401644))
  const epochEnd = useCurrentEpochEnd()
  const nextEpochStart = useNextEpochStart()
  const currentTimestamp = useCurrentBlockTimestamp()
  const onTally = useEpochOnTally()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Box padding={['16px', '16px', '16px 24px 24px']}>
      <FlexGap gap="8px" flexDirection="column">
        <AutoRow justifyContent="space-between">
          <FlexGap
            flexDirection={['column', 'row', 'row']}
            gap="8px"
            flexWrap="wrap"
            alignItems="baseline"
            justifyContent="space-between"
            width="100%"
          >
            <Text bold fontSize={20}>
              {t('Current EPOCH')}
            </Text>
            <FlexGap
              justifyContent={['space-between', 'space-between', 'flex-end']}
              alignItems="baseline"
              gap="4px"
              width={isDesktop ? 'auto' : '100%'}
            >
              <Tooltips
                content={t('Results for the current epoch will be snapshotted and tallied at 00:00 UTC on %date%.', {
                  date: dayjs.unix(nextEpochStart).format('DD MMM YYYY'),
                })}
              >
                <TooltipText fontSize={14} color="textSubtle">
                  {t('snapshots in')}
                </TooltipText>
              </Tooltips>
              <FlexGap gap="2px" alignItems="baseline">
                <Text bold fontSize={16}>
                  {dayjs.unix(nextEpochStart).from(dayjs.unix(currentTimestamp), true)}
                </Text>
                <Text fontSize={14}>({dayjs.unix(nextEpochStart).format('DD MMM YYYY')}) </Text>
              </FlexGap>
            </FlexGap>
          </FlexGap>

          <FlexGap gap="8px" alignItems="baseline" justifyContent="space-between" width="100%">
            <Tooltips
              content={t(
                'Cast your vote before 00:00 UTC, %date% on this day to include them into the current epoch.',
                { date: dayjs.unix(epochEnd).format('DD MMM YYYY') },
              )}
            >
              <TooltipText fontSize={14} color="textSubtle">
                {t('Voting ends in')}
              </TooltipText>
            </Tooltips>
            <FlexGap alignItems="baseline" gap="2px">
              <Text bold fontSize={16}>
                {onTally ? t('Ended, ') : dayjs.unix(epochEnd).from(dayjs.unix(currentTimestamp), true)}
              </Text>
              {onTally ? (
                <Text fontSize={14} bold>
                  {t('Tallying')}
                </Text>
              ) : (
                <Text fontSize={14}>({dayjs.unix(epochEnd).format('DD MMM YYYY')}) </Text>
              )}
            </FlexGap>
          </FlexGap>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Tooltips
            content={t(
              'The total amount of CAKE rewards to distribute to all the gauges according to the final vote results.',
            )}
          >
            <TooltipText fontSize={14} color="textSubtle">
              {t('CAKE rewards')}
            </TooltipText>
          </Tooltips>

          <FlexGap alignItems="baseline" gap="2px">
            <Text bold fontSize={16}>
              {formatNumber(getBalanceNumber(new BN(weeklyRewards)), 0)}
            </Text>
            <Text fontSize={14}>
              ({getFullDisplayBalance(new BN(weeklyRewards).div(2 * 7 * 24 * 60 * 60), 18, 3)} CAKE/sec){' '}
            </Text>
          </FlexGap>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Tooltips content={t('The total number of veCAKE votes being casted.')}>
            <TooltipText fontSize={14} color="textSubtle">
              {t('Total votes')}
            </TooltipText>
          </Tooltips>
          <Balance bold fontSize={16} value={getBalanceNumber(new BN(totalWeight.toString()))} unit=" veCAKE" />
        </AutoRow>
        <AutoRow alignItems="center" flexDirection="row" justifyContent="flex-start" flexWrap="nowrap" mt="16px">
          <ErrorIcon color="#7A6EAA" width="24px" mr="8px" />
          <Text color="textSubtle" fontSize={12}>
            {t(
              'Results are updated weekly. Vote numbers are estimations based on the veCAKE balance at 00:00 UTC on the upcoming Thursday.',
            )}
          </Text>
        </AutoRow>
      </FlexGap>
    </Box>
  )
}
