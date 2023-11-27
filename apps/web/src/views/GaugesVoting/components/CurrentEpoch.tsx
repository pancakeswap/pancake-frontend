import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Balance, Card, FlexGap, Text, TooltipText, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useEpochRewards } from '../hooks/useEpochRewards'
import { useCurrentEpochEnd, useEpochOnTally, useNextEpochStart } from '../hooks/useEpochTime'
import { useGaugesTotalWeight } from '../hooks/useGaugesTotalWeight'

export const CurrentEpoch = () => {
  const { t } = useTranslation()
  const totalWeight = useGaugesTotalWeight()
  const weeklyRewards = useEpochRewards()
  const epochEnd = useCurrentEpochEnd()
  const nextEpochStart = useNextEpochStart()
  const currentTimestamp = useCurrentBlockTimestamp()
  const onTally = useEpochOnTally()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Card isActive innerCardProps={{ padding: isDesktop ? '1.5em' : '1em' }}>
      <FlexGap gap="8px" flexDirection="column">
        <AutoRow justifyContent="space-between">
          <FlexGap gap="8px" alignItems="baseline" justifyContent="space-between" width="100%">
            <Text bold fontSize={20}>
              {t('Current EPOCH')}
            </Text>
            <FlexGap alignItems="baseline" gap="2px">
              <Tooltips
                content={t('Results for the current epoch will be snapshotted and tallied at 00:00 UTC on %date%.', {
                  date: dayjs.unix(nextEpochStart).format('DD MMM YYYY'),
                })}
              >
                <TooltipText fontSize={14} color="textSubtle">
                  {t('snapshots in')}
                </TooltipText>
              </Tooltips>
              <Text bold fontSize={16}>
                {dayjs.unix(nextEpochStart).from(dayjs.unix(currentTimestamp), true)}
              </Text>
              <Text fontSize={14}>({dayjs.unix(nextEpochStart).format('DD MMM YYYY')}) </Text>
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
              {getFullDisplayBalance(new BN(weeklyRewards))}
            </Text>
            <Text fontSize={14}>
              ({getFullDisplayBalance(new BN(weeklyRewards).div(1 * 7 * 24 * 60 * 60), 18, 3)} CAKE/sec){' '}
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
      </FlexGap>
    </Card>
  )
}
