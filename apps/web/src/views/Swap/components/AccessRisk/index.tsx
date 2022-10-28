import { useState, useMemo, useCallback } from 'react'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Button, HelpIcon, useTooltip, Text, Link, useToast } from '@pancakeswap/uikit'
import { fetchRiskToken, RiskTokenInfo } from 'views/Swap/hooks/fetchTokenRisk'
import RiskMessage from 'views/Swap/components/AccessRisk/RiskMessage'
import { tokenListFromOfficialsUrlsAtom } from 'state/lists/hooks'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import { useAtomValue } from 'jotai'

interface AccessRiskProps {
  inputCurrency: Currency
  outputCurrency: Currency
}

const AccessRisk: React.FC<AccessRiskProps> = ({ inputCurrency, outputCurrency }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const tokenMap = useAtomValue(tokenListFromOfficialsUrlsAtom)

  const { address: inputAddress, chainId: inputChainId } = useMemo(() => (inputCurrency as any) ?? {}, [inputCurrency])
  const { address: outputAddress, chainId: outputChainId } = useMemo(
    () => (outputCurrency as any) ?? {},
    [outputCurrency],
  )

  const [{ results, loading }, setState] = useState<{
    results: { [chainId: number]: { [address: string]: RiskTokenInfo } }
    loading: boolean
  }>({
    results: {},
    loading: false,
  })
  const tokensForScan = useMemo(() => {
    const tokensToScan = []
    if (
      inputCurrency &&
      !inputCurrency.isNative &&
      !results[inputChainId]?.[inputAddress] &&
      !tokenMap?.[inputChainId]?.[inputAddress]
    ) {
      tokensToScan.push(inputCurrency)
    }
    if (outputCurrency && !outputCurrency.isNative && !results[outputChainId]?.[outputAddress]) {
      tokensToScan.push(outputCurrency)
    }
    return tokensToScan
  }, [results, inputAddress, inputChainId, outputAddress, outputChainId, inputCurrency, outputCurrency, tokenMap])

  const handleScan = useCallback(() => {
    const fetchTokenRisks = async () => {
      const tokenRiskResults = await Promise.all(
        tokensForScan.map((tokenToScan) => {
          const { address, chainId } = tokenToScan as any
          return fetchRiskToken(address, chainId)
        }),
      )

      setState((prevState) => ({
        ...prevState,
        loading: false,
        results: merge(
          { ...prevState.results },
          mapValues(groupBy(tokenRiskResults, 'chainId'), (tokenRiskResult) => keyBy(tokenRiskResult, 'address')),
        ),
      }))
    }

    toastInfo(
      t('Scanning Risk'),
      t('Please wait until we scan the risk for %symbol% token', {
        symbol: tokensForScan.map((currency) => currency.symbol).join(','),
      }),
    )
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }))
    fetchTokenRisks()
  }, [tokensForScan, toastInfo, t])

  const disabledButton = useMemo(() => loading || tokensForScan.length === 0, [loading, tokensForScan])

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
          {loading ? t('scanning...') : t('scan risk')}
        </Button>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
      {results[inputChainId]?.[inputAddress]?.isSuccess && (
        <RiskMessage currency={inputCurrency} riskTokenInfo={results[inputChainId][inputAddress]} />
      )}
      {results[outputChainId]?.[outputAddress]?.isSuccess && (
        <RiskMessage currency={outputCurrency} riskTokenInfo={results[outputChainId][outputAddress]} />
      )}
    </>
  )
}

export default AccessRisk
