import { Token } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Balance, BoxProps, Flex, Heading, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { TokenImage } from 'components/TokenImage'

interface EarnedTokenInfoProps extends BoxProps {
  token: Token
  displayBalance: string
  earningsBalance: BigNumber
  earningsBusd: number
}

export const EarnedTokenInfo: React.FC<React.PropsWithChildren<EarnedTokenInfoProps>> = ({
  token,
  displayBalance,
  earningsBalance,
  earningsBusd,
}) => {
  const { t } = useTranslation()

  return (
    <Flex flex={1} flexDirection="column">
      <Flex>
        <TokenImage style={{ minWidth: '16px' }} width={16} height={16} token={token} />
        <Text ml="4px" bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {token.symbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={earningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
    </Flex>
  )
}
