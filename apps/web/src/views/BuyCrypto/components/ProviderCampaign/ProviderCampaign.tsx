import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, InfoFilledIcon, Text } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import Image from 'next/image'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import pocketWatch from '../../../../../public/images/pocket-watch.svg'
import BuyCryptoTooltip from '../Tooltip/Tooltip'

const CURRENT_CAMPAIGN_TIMESTAMP = 1726578000 // 17th sep 2024

export const activeCampaigns: { [provider in keyof typeof ONRAMP_PROVIDERS]: boolean } = {
  [ONRAMP_PROVIDERS.Mercuryo]: false,
  [ONRAMP_PROVIDERS.MoonPay]: false,
  [ONRAMP_PROVIDERS.Transak]: false,
  [ONRAMP_PROVIDERS.Topper]: false,
}

const ProviderCampaign = () => {
  const { t } = useTranslation()

  const currentTimestamp = Math.floor(Date.now() / 1000)
  const activeCampaignExsits = Object.values(activeCampaigns).find((c) => !!c)

  const {
    days,
    hours,
    minutes,
    seconds: campaignEndTimeInSeconds,
  } = getTimePeriods(currentTimestamp - CURRENT_CAMPAIGN_TIMESTAMP)

  if (!activeCampaignExsits || campaignEndTimeInSeconds <= 0) return null
  return (
    <Box background="#F0E4E2" padding="16px" border="1px solid #D67E0A" borderRadius="16px">
      <Flex>
        <Image src={pocketWatch} alt="pocket-watch" height={30} width={30} />
        <BuyCryptoTooltip
          tooltipBody={
            <Text marginLeft="14px" fontSize="15px" color="#D67E0B">
              {t('0 fees for Topper. Ends in %days% days, %hours% hours, %minutes% minutes', {
                days,
                hours,
                minutes,
              })}

              <InfoFilledIcon pl="4px" width={17} height={12} opacity={0.7} color="#D67E0B" />
            </Text>
          }
          tooltipContent={
            <Text as="p">
              {t('Provider fees are waived for this period. Please note that a 1% PancakeSwap fee still applies.')}
            </Text>
          }
        />
      </Flex>
    </Box>
  )
}

export default ProviderCampaign
