import { useState, useEffect, useMemo } from 'react'
import { Currency, ChainId } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Button, HelpIcon, useTooltip, Text, Link, useToast } from '@pancakeswap/uikit'
import { fetchRiskToken, TokenRiskPhases, RiskTokenInfo } from 'views/Swap/hooks/fetchTokenRisk'
import RiskMessage from 'views/Swap/components/AccessRisk/RiskMessage'

interface AccessRiskProps {
  currency: Currency
}

const AccessRisk: React.FC<AccessRiskProps> = ({ currency }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()

  const [isScanning, setIsScanning] = useState(false)
  const [isFetchStatusSuccess, setIsFetchStatusSuccess] = useState(false)
  const [allTokenInfo, setAllTokenInfo] = useState<{ [key: number]: RiskTokenInfo }>({})
  const [riskTokenInfo, setRiskTokenInfo] = useState<RiskTokenInfo>({
    isSuccess: false,
    address: '',
    chainId: ChainId.BSC,
    riskLevel: TokenRiskPhases[0],
    riskResult: '',
    scannedTs: 0,
    riskLevelDescription: '',
  })

  useEffect(() => {
    if (currency) {
      setIsScanning(false)
      setIsFetchStatusSuccess(false)

      const { address, chainId } = currency as any
      if (allTokenInfo) {
        const list = allTokenInfo[chainId]
        if (list?.[address]) {
          setRiskTokenInfo(list[address])
          setIsFetchStatusSuccess(list[address].isSuccess)
        }
      }
    }
  }, [currency, allTokenInfo])

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
    if (tokenRiskResult.isSuccess && tokenRiskResult.address === address) {
      setIsScanning(false)
      saveRiskTokenInfo(tokenRiskResult)
    }
  }

  const saveRiskTokenInfo = (data: RiskTokenInfo) => {
    const { address, chainId } = data
    const getRiskTokenList = allTokenInfo
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
    setAllTokenInfo(newData)
  }

  // Tooltips
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t(
          'The scan result is provided by 3rd parties and may not cover every token. Therefore the result is for reference only, do NOT take it as investment or financial advice. Always DYOR!',
        )}
      </Text>
      <Flex mt="4px">
        <Text>{t('Powered by')}</Text>
        <Link ml="4px" external href="https://www.hashdit.io/en">
          {t('Hashdit.')}
        </Link>
      </Flex>
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
