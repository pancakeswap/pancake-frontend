import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import Image from 'next/image'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import pocketWatch from '../../../../../public/images/pocket-watch.svg'

const CURRENT_CAMPAIGN_TIMESTAMP = 0

const activeCampaigns: { [provider in keyof typeof ONRAMP_PROVIDERS]: boolean } = {
  [ONRAMP_PROVIDERS.Mercuryo]: false,
  [ONRAMP_PROVIDERS.MoonPay]: false,
  [ONRAMP_PROVIDERS.Transak]: false,
}

const ProviderCampaign = ({ provider }: { provider: keyof typeof ONRAMP_PROVIDERS }) => {
  const { t } = useTranslation()

  const currentTimestamp = Math.floor(Date.now() / 1000)
  const {
    days,
    hours,
    minutes,
    seconds: campaignEndTimeInSeconds,
  } = getTimePeriods(currentTimestamp - CURRENT_CAMPAIGN_TIMESTAMP)

  return (
    <>
      {activeCampaigns[provider] && campaignEndTimeInSeconds >= 1 ? (
        <Box mt="16px" background="#F0E4E2" padding="16px" border="1px solid #D67E0A" borderRadius="16px">
          <Flex>
            <Image src={pocketWatch} alt="pocket-watch" height={30} width={30} />
            <Text marginLeft="14px" fontSize="15px" color="#D67E0B">
              {t('No provider fees. Ends in %days% days and %hours% hours and %minutes% minutes.', {
                days,
                hours,
                minutes,
              })}
            </Text>
          </Flex>
        </Box>
      ) : null}
    </>
  )
}

export default ProviderCampaign
