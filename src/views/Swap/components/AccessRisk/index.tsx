import { useState, useEffect } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { Flex, Button, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import { fetchTokenRisk, TokenRiskPhases, TokenRiskInfo } from 'views/Swap/hooks/fetchTokenRisk'
import RiskMessage from 'views/Swap/components/AccessRisk/RiskMessage'

interface AccessRiskProps {
  currency: Currency
}

const AccessRisk: React.FC<AccessRiskProps> = ({ currency }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const [isAccessing, setIsAccessing] = useState(false)
  const [tokenRiskInfo, setTokenRiskInfo] = useState<TokenRiskInfo>({
    isSuccess: false,
    riskLevel: TokenRiskPhases[1],
    riskResult: '',
    scannedTs: 0,
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    'The risk level is for reference only, not as investment advice. Powered by Hashdit.',
    { placement: 'bottom' },
  )

  useEffect(() => {
    setIsAccessing(false)
  }, [currency])

  const handleAccess = async () => {
    const { address, chainId, symbol } = currency as any

    setIsAccessing(true)
    toastInfo(t('Accessing Risk'), t('Please wait until we scan the risk for %symbol% token', { symbol }))

    // const tokenRiskResult = await fetchTokenRisk(address, chainId)
  }

  return (
    <>
      <Flex justifyContent="flex-end">
        <Button scale="xs" style={{ textTransform: 'uppercase' }} disabled={isAccessing} onClick={handleAccess}>
          {isAccessing ? t('Accessing...') : t('Access risk')}
        </Button>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
      <RiskMessage currency={currency} tokenRiskInfo={tokenRiskInfo} />
    </>
  )
}

export default AccessRisk
