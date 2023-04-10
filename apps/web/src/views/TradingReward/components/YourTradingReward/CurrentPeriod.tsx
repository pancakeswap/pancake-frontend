import { useMemo } from 'react'
import { Box, Flex, Card, Text, Balance, InfoIcon } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'

interface CurrentPeriodProps {
  currentCanClaim: string
  currentTradingVolume: number
  campaignClaimTime: number
}

const CurrentPeriod: React.FC<React.PropsWithChildren<CurrentPeriodProps>> = ({
  currentCanClaim,
  currentTradingVolume,
  campaignClaimTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const timeUntil = getTimePeriods(campaignClaimTime)
  const cakePriceBusd = useCakeBusdPrice()

  const cakeBalance = useMemo(() => getBalanceNumber(new BigNumber(currentCanClaim)), [currentCanClaim])
  const rewardInBusd = useMemo(() => multiplyPriceByAmount(cakePriceBusd, cakeBalance), [cakeBalance, cakePriceBusd])

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
            <Balance bold fontSize={['40px']} prefix="$ " decimals={2} value={rewardInBusd} />
            <Balance fontSize="14px" color="textSubtle" prefix="~ " unit=" CAKE" decimals={2} value={cakeBalance} />
            <Text fontSize="12px" color="textSubtle" mt="4px">
              {t('Available for claiming')}
              {timeUntil.days || timeUntil.hours || timeUntil.minutes ? (
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
            <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={currentTradingVolume} />
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
