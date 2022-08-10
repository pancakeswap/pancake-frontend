import { useState, useEffect, useMemo } from 'react'
import { Currency, ChainId } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { Flex, Button, HelpIcon, useTooltip, Text } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import { fetchRiskToken, TokenRiskPhases, RiskTokenInfo } from 'views/Swap/hooks/fetchTokenRisk'
import RiskMessage from 'views/Swap/components/AccessRisk/RiskMessage'

interface AccessRiskProps {
  currency: Currency
}

const TOKEN_RISK_KEY = 'pancakeswap-risk-token'

const AccessRisk: React.FC<AccessRiskProps> = ({ currency }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()

  const [isScanning, setIsScanning] = useState(false)
  const [isFetchStatusSuccess, setIsFetchStatusSuccess] = useState(false)
  const [riskTokenInfo, setRiskTokenInfo] = useState<RiskTokenInfo>({
    isSuccess: false,
    address: '',
    chainId: ChainId.BSC,
    riskLevel: TokenRiskPhases[0],
    riskResult: '',
    scannedTs: 0,
  })

  useEffect(() => {
    if (currency) {
      setIsScanning(false)
      setIsFetchStatusSuccess(false)

      const { address, chainId } = currency as any
      const storeData = localStorage.getItem(TOKEN_RISK_KEY)
      const getRiskTokenList = storeData ? JSON.parse(storeData) : {}

      if (getRiskTokenList) {
        const list = getRiskTokenList[chainId]
        if (list?.[address]) {
          const now = new Date()
          const sevenDaysInMilliseconds = 60 * 60 * 24 * 7 * 1000
          const expiredDate = list[address].createDate + sevenDaysInMilliseconds
          // If create Date more than 7 days. User need to fetch it again
          if (now.getTime() <= expiredDate) {
            setRiskTokenInfo(list[address])
            setIsFetchStatusSuccess(list[address].isSuccess)
          }
        }
      }
    }
  }, [currency])

  const disabledButton = useMemo(() => {
    if (currency) {
      const { address } = currency as any
      return isScanning || (address === riskTokenInfo.address && riskTokenInfo.isSuccess)
    }
    return false
  }, [currency, riskTokenInfo, isScanning])

  const handleScan = async () => {
    setIsScanning(true)

    const { address, chainId, symbol } = currency as any
    toastInfo(t('Scanning Risk'), t('Please wait until we scan the risk for %symbol% token', { symbol }))

    const tokenRiskResult: RiskTokenInfo = await fetchRiskToken(address, chainId)

    // To avoid response too slow, and user already change to new currency.
    if (tokenRiskResult.address === address) {
      setIsScanning(false)
      saveRiskTokenInfo(tokenRiskResult)
    }
  }

  const saveRiskTokenInfo = (data: RiskTokenInfo) => {
    const { address, chainId } = data
    const storeData = localStorage.getItem(TOKEN_RISK_KEY)
    const getRiskTokenList = storeData ? JSON.parse(storeData) : {}
    const newData = {
      ...getRiskTokenList,
      [chainId]: {
        ...getRiskTokenList[chainId],
        [address]: {
          ...data,
          createDate: new Date().getTime(),
        },
      },
    }

    setRiskTokenInfo(data)
    setIsFetchStatusSuccess(data.isSuccess)
    localStorage.setItem(TOKEN_RISK_KEY, JSON.stringify(newData))
  }

  // Tooltips
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold>
        {t(
          'Scan risk level for the output token. This risk level is for a reference only, not as an investment advice.',
        )}
      </Text>
      <Text bold mt="4px">
        {t('Powered by Hashdit.')}
      </Text>
    </>,
    { placement: 'bottom' },
  )

  return (
    <>
      <Flex justifyContent="flex-end">
        <Button scale="xs" style={{ textTransform: 'uppercase' }} disabled={disabledButton} onClick={handleScan}>
          {isScanning ? t('scanning...') : t('scan risk')}
        </Button>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
      {!isScanning && isFetchStatusSuccess && <RiskMessage currency={currency} riskTokenInfo={riskTokenInfo} />}
    </>
  )
}

export default AccessRisk
