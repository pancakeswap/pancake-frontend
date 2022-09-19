import { useState, useEffect, useMemo, useCallback } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Button, HelpIcon, useTooltip, Text, Link, useToast } from '@pancakeswap/uikit'
import { fetchRiskToken, RiskTokenInfo } from 'views/Swap/hooks/fetchTokenRisk'
import RiskMessage from 'views/Swap/components/AccessRisk/RiskMessage'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'

interface AccessRiskProps {
  inputCurrency: Currency
  outputCurrency: Currency
}

const AccessRisk: React.FC<AccessRiskProps> = ({ inputCurrency, outputCurrency }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()

  const [allTokenInfo, setAllTokenInfo] = useState<{ [key: number]: RiskTokenInfo }>({})
  const [currentRiskTokensInfo, setCurrentRiskTokensInfo] = useState<{
    inputRiskTokenInfo?: RiskTokenInfo
    outputRiskTokenInfo?: RiskTokenInfo
  }>({})
  const [isFetchStatusesSuccess, setIsFetchStatusesSuccess] = useState<{
    inputRiskStatus?: boolean
    outputRiskStatus?: boolean
  }>({})
  const [isTokensScanning, setIsTokensScanning] = useState<{
    inputRiskScanning?: boolean
    outputRiskScanning?: boolean
  }>({})

  const setTokenInfoFromCache = useCallback(
    (currency: Currency, type: 'input' | 'output') => {
      if (currency) {
        const { address, chainId } = currency as any
        const list = allTokenInfo?.[chainId]
        if (list?.[address]) {
          setCurrentRiskTokensInfo((prevState) => ({
            ...prevState,
            [type === 'output' ? 'outputRiskTokenInfo' : 'inputRiskTokenInfo']: list[address],
          }))
          setIsFetchStatusesSuccess((prevState) => ({
            ...prevState,
            [type === 'output' ? 'outputRiskStatus' : 'inputRiskStatus']: list[address].isSuccess,
          }))
          setIsTokensScanning((prevState) => ({
            ...prevState,
            [type === 'output' ? 'outputRiskScanning' : 'inputRiskScanning']: false,
          }))
          return
        }
      }
      setCurrentRiskTokensInfo((prevState) => ({
        ...prevState,
        [type === 'output' ? 'outputRiskTokenInfo' : 'inputRiskTokenInfo']: undefined,
      }))
      setIsFetchStatusesSuccess((prevState) => ({
        ...prevState,
        [type === 'output' ? 'outputRiskStatus' : 'inputRiskStatus']: false,
      }))
      setIsTokensScanning((prevState) => ({
        ...prevState,
        [type === 'output' ? 'outputRiskScanning' : 'inputRiskScanning']: false,
      }))
    },
    [allTokenInfo],
  )

  const saveRiskTokensInfo = useCallback(
    ({
      inputRiskTokenInfo,
      outputRiskTokenInfo,
    }: {
      inputRiskTokenInfo?: RiskTokenInfo
      outputRiskTokenInfo?: RiskTokenInfo
    }) => {
      const updatedRiskTokenList = inputRiskTokenInfo || outputRiskTokenInfo ? { ...allTokenInfo } : allTokenInfo
      if (inputRiskTokenInfo) {
        const { address, chainId } = inputRiskTokenInfo
        merge(updatedRiskTokenList, {
          [chainId]: {
            [address]: {
              ...inputRiskTokenInfo,
              createDate: new Date().getTime(),
            },
          },
        })
      }
      if (outputRiskTokenInfo) {
        const { address, chainId } = outputRiskTokenInfo
        merge(updatedRiskTokenList, {
          [chainId]: {
            [address]: {
              ...outputRiskTokenInfo,
              createDate: new Date().getTime(),
            },
          },
        })
      }

      setCurrentRiskTokensInfo((prevState) => ({
        ...prevState,
        ...(inputRiskTokenInfo ? { inputRiskTokenInfo } : {}),
        ...(outputRiskTokenInfo ? { outputRiskTokenInfo } : {}),
      }))
      setIsFetchStatusesSuccess((prevState) => ({
        ...prevState,
        ...(inputRiskTokenInfo ? { inputRiskStatus: inputRiskTokenInfo.isSuccess } : {}),
        ...(outputRiskTokenInfo ? { outputRiskStatus: outputRiskTokenInfo.isSuccess } : {}),
      }))
      setAllTokenInfo(updatedRiskTokenList)
    },
    [allTokenInfo],
  )

  useEffect(() => {
    setTokenInfoFromCache(inputCurrency, 'input')
  }, [inputCurrency, setTokenInfoFromCache])

  useEffect(() => {
    setTokenInfoFromCache(outputCurrency, 'output')
  }, [outputCurrency, setTokenInfoFromCache])

  const disabledButton = useMemo(() => {
    const inputTokenCurrency = inputCurrency as any
    const outputTokenCurrency = outputCurrency as any
    return (
      (inputTokenCurrency?.isNative ||
        isTokensScanning.inputRiskScanning ||
        (inputTokenCurrency?.address === currentRiskTokensInfo.inputRiskTokenInfo?.address &&
          currentRiskTokensInfo.inputRiskTokenInfo?.isSuccess)) &&
      (outputTokenCurrency?.isNative ||
        isTokensScanning.outputRiskScanning ||
        (outputTokenCurrency?.address === currentRiskTokensInfo.outputRiskTokenInfo?.address &&
          currentRiskTokensInfo.outputRiskTokenInfo?.isSuccess))
    )
  }, [outputCurrency, inputCurrency, currentRiskTokensInfo, isTokensScanning])

  const handleScan = async () => {
    const currencies = { input: inputCurrency, output: outputCurrency }
    const currenciesToScan = pickBy(currencies, (currency, type) => {
      if (currency) {
        const { address } = currency as any
        return (
          address &&
          (address !==
            currentRiskTokensInfo[type === 'output' ? 'outputRiskTokenInfo' : 'inputRiskTokenInfo']?.address ||
            !currentRiskTokensInfo[type === 'output' ? 'outputRiskTokenInfo' : 'inputRiskTokenInfo']?.isSuccess)
        )
      }
      return false
    })

    setIsTokensScanning((prevState) => ({
      ...prevState,
      ...(currenciesToScan.input ? { inputRiskScanning: true } : {}),
      ...(currenciesToScan.output ? { outputRiskScanning: true } : {}),
    }))

    const currenciesToScanValues = Object.values(currenciesToScan)
    const currenciesToScanSymbols = currenciesToScanValues.map((currency) => currency.symbol).join(',')
    toastInfo(
      t('Scanning Risk'),
      t('Please wait until we scan the risk for %symbol% token', { symbol: currenciesToScanSymbols }),
    )

    let inputTokenRiskResult: RiskTokenInfo = null
    let outputTokenRiskResult: RiskTokenInfo = null

    if (currenciesToScan.input) {
      const { address, chainId } = inputCurrency as any
      inputTokenRiskResult = await fetchRiskToken(address, chainId)
    }
    if (currenciesToScan.output) {
      const { address, chainId } = outputCurrency as any
      outputTokenRiskResult = await fetchRiskToken(address, chainId)
    }

    // To avoid response too slow, and user already change to new currency.
    setIsTokensScanning((prevState) => ({
      ...prevState,
      ...(inputTokenRiskResult?.isSuccess && inputTokenRiskResult?.address === (inputCurrency as any)?.address
        ? { inputRiskScanning: false }
        : {}),
      ...(outputTokenRiskResult?.isSuccess && outputTokenRiskResult?.address === (outputCurrency as any)?.address
        ? { outputRiskScanning: false }
        : {}),
    }))
    saveRiskTokensInfo({
      ...(inputTokenRiskResult?.isSuccess && inputTokenRiskResult?.address === (inputCurrency as any)?.address
        ? { inputRiskTokenInfo: inputTokenRiskResult }
        : {}),
      ...(outputTokenRiskResult?.isSuccess && outputTokenRiskResult?.address === (outputCurrency as any)?.address
        ? { outputRiskTokenInfo: outputTokenRiskResult }
        : {}),
    })
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
          {isTokensScanning.inputRiskScanning || isTokensScanning.outputRiskScanning
            ? t('scanning...')
            : t('scan risk')}
        </Button>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
      {!isTokensScanning.inputRiskScanning && isFetchStatusesSuccess.inputRiskStatus && (
        <RiskMessage currency={inputCurrency} riskTokenInfo={currentRiskTokensInfo.inputRiskTokenInfo} />
      )}
      {!isTokensScanning.outputRiskScanning && isFetchStatusesSuccess.outputRiskStatus && (
        <RiskMessage currency={outputCurrency} riskTokenInfo={currentRiskTokensInfo.outputRiskTokenInfo} />
      )}
    </>
  )
}

export default AccessRisk
