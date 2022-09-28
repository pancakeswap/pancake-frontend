import { useMemo } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Message, MessageText, Text, Link } from '@pancakeswap/uikit'
import { RiskTokenInfo, TOKEN_RISK } from 'views/Swap/hooks/fetchTokenRisk'

interface RiskMessageProps {
  currency: Currency
  riskTokenInfo: RiskTokenInfo
}

const RiskMessage: React.FC<RiskMessageProps> = ({ currency, riskTokenInfo }) => {
  const { t } = useTranslation()
  const { riskLevel, riskLevelDescription } = riskTokenInfo

  const messageVariant = useMemo(() => {
    switch (riskLevel) {
      case TOKEN_RISK.High:
        return 'danger'
      case TOKEN_RISK.Medium:
        return 'warning'
      default:
        return 'success'
    }
  }, [riskLevel])

  return (
    <Message variant={messageVariant} icon="" mt="10px">
      <MessageText bold ml="-12px">
        {currency.symbol} {t('%riskLevel% Risk', { riskLevel })}
        <Flex mt="4px">
          <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
          <Flex flexDirection="column">
            <Text fontSize="14px" lineHeight="120%">
              {riskLevelDescription}
            </Text>
            <Link
              fontSize="14px"
              mt="8px"
              ml="auto"
              external
              href="https://hashdit.github.io/hashdit/docs/risk-level-description/"
            >
              {t('Learn More')}
            </Link>
          </Flex>
        </Flex>
      </MessageText>
    </Message>
  )
}

export default RiskMessage
