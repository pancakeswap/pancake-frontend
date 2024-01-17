import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Flex, FlexProps, Text } from '@pancakeswap/uikit'
import { useTokenUsdPriceBigNumber } from 'views/Predictions/hooks/useTokenPrice'

export const Row: React.FC<React.PropsWithChildren<FlexProps>> = ({ children, ...props }) => {
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
  token: Token | undefined
}

export const NetWinnings: React.FC<React.PropsWithChildren<NetWinningsProps>> = ({ token, ...props }) => {
  return <NetWinningsView token={token} {...props} />
}

export const NetWinningsView: React.FC<React.PropsWithChildren<NetWinningsProps>> = ({
  token,
  amount,
  textPrefix = '',
  textColor = 'text',
  ...props
}) => {
  const tokenPrice = useTokenUsdPriceBigNumber(token, !!amount)
  if (!amount) {
    return null
  }
  const value = tokenPrice.multipliedBy(Math.abs(amount)).toNumber()

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

export const NetWinningsRow: React.FC<React.PropsWithChildren<{ amount: number; token: Token | undefined }>> = ({
  amount,
  token,
}) => {
  const { t } = useTranslation()

  return (
    <Row mb="4px">
      <Text fontSize="12px" color="textSubtle">
        {t('Net Winnings (%symbol%)', { symbol: token?.symbol })}
      </Text>
      <NetWinnings
        amount={amount}
        token={token}
        textPrefix={amount > 0 ? '+' : ''}
        textColor={amount > 0 ? 'success' : 'failure'}
      />
    </Row>
  )
}
