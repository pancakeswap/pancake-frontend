import { Currency } from '@pancakeswap/sdk'
import { Flex, Text } from '@pancakeswap/uikit'
import CurrencyLogo from 'components/Logo/CurrencyLogo'

interface CurrencyFormatProps {
  currency: Currency
  bold?: boolean
}

const CurrencyFormat: React.FC<CurrencyFormatProps> = ({ currency, bold }) => {
  return (
    <Flex alignItems="center">
      <Text color="text" mr="8px" bold={bold}>
        {currency?.symbol.toUpperCase()}
      </Text>
      <CurrencyLogo currency={currency} />
    </Flex>
  )
}

export default CurrencyFormat
