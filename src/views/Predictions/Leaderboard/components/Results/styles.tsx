import { Token } from '@pancakeswap/sdk'
import { Flex, FlexProps, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useConfig } from 'views/Predictions/context/ConfigProvider'

export const Row: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {children}
    </Flex>
  )
}

interface NetWinningsProps extends FlexProps {
  amount: number
  textPrefix?: string
  textColor?: string
}

export const NetWinnings: React.FC<NetWinningsProps> = (props) => {
  const { token } = useConfig()
  return <NetWinningsView token={token} {...props} />
}

export const NetWinningsView: React.FC<NetWinningsProps & { token: Token }> = ({
  token,
  amount,
  textPrefix = '',
  textColor = 'text',
  ...props
}) => {
  const bnbBusdPrice = useBUSDPrice(token)
  const value = multiplyPriceByAmount(bnbBusdPrice, Math.abs(amount))

  if (!amount) {
    return null
  }

  return (
    <Flex flexDirection="column" alignItems="flex-end" {...props}>
      <Text fontWeight="bold" color={textColor}>
        {`${textPrefix}${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 })}`}
      </Text>
      <Text fontSize="12px" color="textSubtle" lineHeight={1}>
        {`~$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      </Text>
    </Flex>
  )
}

export const NetWinningsRow: React.FC<{ amount: number }> = ({ amount }) => {
  const { t } = useTranslation()
  const { token } = useConfig()

  return (
    <Row mb="4px">
      <Text fontSize="12px" color="textSubtle">
        {t('Net Winnings (%symbol%)', { symbol: token.symbol })}
      </Text>
      <NetWinnings amount={amount} textPrefix={amount > 0 ? '+' : ''} textColor={amount > 0 ? 'success' : 'failure'} />
    </Row>
  )
}
