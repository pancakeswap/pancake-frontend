import { LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const STGWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'Please exercise caution when trading / providing liquidity for the STG token, as the token may migrate to a new contract address on 15 Mar 2023',
        )}
      </Text>
      <LinkExternal href="https://twitter.com/StargateFinance/status/1629277447962214402">
        {t('For more information, please refer to Stargate’s announcement')}
      </LinkExternal>
      <br />
      <LinkExternal href="https://snapshot.org/#/stgdao.eth/proposal/0xd0e742caae098261a030feaed2f10d1a36646bdf0ac8d4a128bfb241ca87d8f5">
        {t('To keep track of developments surrounding the reissuance, please refer to this snapshot vote')}
      </LinkExternal>
    </>
  )
}

export default STGWarning
