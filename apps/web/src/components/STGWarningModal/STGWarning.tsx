import { LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const STGWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'On 15 March 2023, the STG token will migrate to a new address. You must remove your own DEX liquidity before 15 March 2023, otherwise your LP position may be negatively affected by the price action as the old STG token will be completely worthless',
        )}
      </Text>
      <LinkExternal href="https://twitter.com/StargateFinance/status/1629277447962214402">
        {t('For more information, please refer to Stargate’s announcement')}
      </LinkExternal>{' '}
    </>
  )
}

export default STGWarning
