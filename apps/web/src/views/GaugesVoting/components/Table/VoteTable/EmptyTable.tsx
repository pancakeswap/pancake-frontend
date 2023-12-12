import { useTranslation } from '@pancakeswap/localization'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'

export const EmptyTable = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <Text m={['24px', '24px', '36px']} fontSize="16px" textAlign="center" mb={isDesktop ? '-2em' : '-1em'}>
      {t('You are not currently voting any gauges.')}
    </Text>
  )
}
