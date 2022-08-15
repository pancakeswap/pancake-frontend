import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'

const FREEWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t(
          'Risk Warning: This token is subject to high price risk. Please do your own research before trading this token. Please also note that as of 24 June 2022 there is also a reflection fee for every transfer of FREE ranging from 2.5 to 5% per trade/transfer.',
        )}
      </Text>
    </>
  )
}

export default FREEWarning
