import { Currency } from '@pancakeswap/sdk'
import { Flex, Text } from '@pancakeswap/uikit'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import TextIcon from './TextIcon'

interface CurrencyFormatProps {
  currency: Currency
  bold?: boolean
}

const CurrencyFormat: React.FC<CurrencyFormatProps> = ({ currency, bold }) => {
  return <TextIcon bold={bold} text={currency?.symbol} icon={<CurrencyLogo currency={currency} />} />
}

export default CurrencyFormat
