import { Box, Card, Text, Message, MessageText, LightBulbIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyCard } from 'components/Card'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

interface CurrentPeriodProps {
  campaignClaimTime: number
}

const CurrentPeriod: React.FC<React.PropsWithChildren<CurrentPeriodProps>> = ({ campaignClaimTime }) => {
  const { t } = useTranslation()

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = campaignClaimTime - currentDate
  const timeUntil = getTimePeriods(timeRemaining)

  return (
    <Box width={['100%', '100%', '100%', '48.5%']} mb={['24px', '24px', '24px', '0']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Current Period')}
          </Text>
          <Box>
            <GreyCard mb="24px">
              <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                {t('Your Current trading rewards')}
              </Text>
              <Text color="text" fontSize="40px" bold mb="4px" lineHeight="110%">
                #523
              </Text>
              <Text fontSize="14px" color="textSubtle">
                {t('out of 3512 traders')}
              </Text>
            </GreyCard>

            <GreyCard>
              <Text textTransform="uppercase" fontSize="12px" color="textSubtle" bold mb="4px">
                {t('Your Trading Reward')}
              </Text>
              <Text color="text" fontSize="24px" bold mb="4px" lineHeight="110%">
                $13.42
              </Text>
              <Text color="textDisabled" fontSize="14px">
                ~34.94 CAKE
              </Text>
            </GreyCard>

            <Message mt="24px" variant="success" icon={<LightBulbIcon color="#1FC7D4" width="24px" />}>
              <MessageText>
                <Box>
                  <Text fontSize="14px" color="primary" as="span">
                    {t('Keep trading to rank')}
                  </Text>
                  <Text fontSize="14px" color="primary" as="span" bold m="0 4px">
                    {t('#500 or less')}
                  </Text>
                  <Text fontSize="14px" color="primary" as="span">
                    {t('and maintain till the end of the campaign to win and claim your rewards.')}
                  </Text>
                </Box>
                <Box mt="10px">
                  <Text fontSize="14px" color="primary" as="span">
                    {t('Campaign ending')}
                    {timeRemaining > 0 ? (
                      <Text bold fontSize="1px" color="primary" as="span" ml="4px">
                        {t('in')}
                        {timeUntil.months ? (
                          <Text bold fontSize="14px" color="primary" as="span" ml="4px">
                            {`${timeUntil.months}${t('m')}`}
                          </Text>
                        ) : null}
                        {timeUntil.days ? (
                          <Text bold fontSize="14px" color="primary" as="span" ml="4px">
                            {`${timeUntil.days}${t('d')}`}
                          </Text>
                        ) : null}
                        {timeUntil.days || timeUntil.hours ? (
                          <Text bold fontSize="14px" color="primary" as="span" ml="4px">
                            {`${timeUntil.hours}${t('h')}`}
                          </Text>
                        ) : null}
                        <Text bold fontSize="14px" color="primary" as="span" ml="4px">
                          {`${timeUntil.minutes}${t('m')}`}
                        </Text>
                      </Text>
                    ) : null}
                  </Text>
                </Box>
              </MessageText>
            </Message>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
