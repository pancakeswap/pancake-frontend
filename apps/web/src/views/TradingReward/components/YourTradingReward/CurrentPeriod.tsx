import { useMemo } from 'react'
import { Box, Flex, Card, Text, InfoIcon } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'

interface CurrentPeriodProps {
  estimateReward: number
  currentTradingVolume: number
  campaignClaimTime: number
}

const CurrentPeriod: React.FC<React.PropsWithChildren<CurrentPeriodProps>> = ({
  estimateReward,
  currentTradingVolume,
  campaignClaimTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = campaignClaimTime - currentDate
  const timeUntil = getTimePeriods(timeRemaining)

  const cakePriceBusd = useCakeBusdPrice()

  const rewardInBusd = useMemo(
    () => multiplyPriceByAmount(cakePriceBusd, estimateReward),
    [estimateReward, cakePriceBusd],
  )

  return (
    <Box width={['100%', '100%', '100%', '48.5%']} mb={['24px', '24px', '24px', '0']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Current Period')}
          </Text>
          <GreyCard>
            <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
              {t('Your Current trading rewards')}
            </Text>
            <Text bold fontSize="40px">{`$ ${formatNumber(rewardInBusd)}`}</Text>
            <Text fontSize="14px" color="textSubtle">{`~ ${formatNumber(estimateReward)} CAKE`}</Text>
            <Text fontSize="12px" color="textSubtle" mt="4px">
              {t('Available for claiming')}
              {timeRemaining > 0 ? (
                <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                  {t('in')}
                  {timeUntil.days ? (
                    <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                      {`${timeUntil.days}${t('d')}`}
                    </Text>
                  ) : null}
                  {timeUntil.days || timeUntil.hours ? (
                    <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                      {`${timeUntil.hours}${t('h')}`}
                    </Text>
                  ) : null}
                  <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                    {`${timeUntil.minutes}${t('m')}`}
                  </Text>
                </Text>
              ) : null}
              <Text fontSize="12px" color="textSubtle" ml="4px" as="span">
                {t('(at ~%date%)', { date: timeFormat(locale, campaignClaimTime) })}
              </Text>
            </Text>
          </GreyCard>
          <GreyCard mt="24px">
            <Flex>
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your Current Trading VOLUME')}
              </Text>
              <InfoIcon color="secondary" width={16} height={16} ml="4px" />
            </Flex>
            <Text bold fontSize="24px">{`$ ${formatNumber(currentTradingVolume)}`}</Text>
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
