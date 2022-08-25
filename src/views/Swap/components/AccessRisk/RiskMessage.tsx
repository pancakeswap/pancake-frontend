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
  const { riskLevel } = riskTokenInfo

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
        {t('%riskLevel% Risk', { riskLevel })}
        <Flex mt="4px">
          <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
          <Flex flexDirection="column">
            <Text fontSize="14px" lineHeight="120%">
              Although no obvious risk is found in the address, it is not guaranteed that there is 100% no risk for the
              address as the project can still fail or the token price can go down under natural market forces.
            </Text>
            <Link fontSize="14px" mt="8px" ml="auto" external href="https://www.hashdit.io/en">
              {t('Learn More')}
            </Link>
          </Flex>
          {/* <Text fontSize="14px" lineHeight="120%">
            <Text fontSize="14px" bold mr="4px" as="span" lineHeight="120%">
              {currency?.symbol}
            </Text>
            {t('is in the average category with %riskLevel% risk', {
              riskLevel: riskLevel.toLowerCase(),
            })}
          </Text> */}
        </Flex>
      </MessageText>
    </Message>
  )
}

export default RiskMessage
