import { Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

const YourDeposit: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Deposit')}
        </Text>
      </Box>
      <Balance bold decimals={3} fontSize="24px" lineHeight="110%" value={1483.45} />
      <Balance prefix="~" decimals={2} value={400} fontSize="12px" color="textSubtle" />
    </Box>
  )
}

export default YourDeposit
