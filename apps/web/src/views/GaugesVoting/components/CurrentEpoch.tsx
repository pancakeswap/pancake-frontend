import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Balance, Card, FlexGap, Text, TooltipText } from '@pancakeswap/uikit'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useEpochRewards } from '../hooks/useEpochRewards'
import { useGaugeEpochEnd } from '../hooks/useGaugeEpochEnd'
import { useGaugesTotalWeight } from '../hooks/useGaugesTotalWeight'

export const CurrentEpoch = () => {
  const { t } = useTranslation()
  const totalWeight = useGaugesTotalWeight()
  const weeklyRewards = useEpochRewards()
  const epochEnd = useGaugeEpochEnd()
  const currentTimestamp = useCurrentBlockTimestamp()

  return (
    <Card isActive innerCardProps={{ padding: 24 }}>
      <FlexGap gap="8px" flexDirection="column">
        <AutoRow justifyContent="space-between">
          <Text bold fontSize={20}>
            {t('Current Epoch')}
          </Text>

          <FlexGap gap="8px" alignItems="baseline">
            <Tooltips content={t('@todo')}>
              <TooltipText fontSize={14} color="textSubtle">
                {t('Ends in')}
              </TooltipText>
            </Tooltips>
            <FlexGap alignItems="baseline" gap="2px">
              <Text bold fontSize={16}>
                {dayjs.unix(epochEnd).from(currentTimestamp)}
              </Text>
              <Text fontSize={14}>({dayjs.unix(epochEnd).format('DD MMM YYYY')}) </Text>
            </FlexGap>
          </FlexGap>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Tooltips content={t('@todo')}>
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
          <Tooltips content={t('@todo')}>
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
