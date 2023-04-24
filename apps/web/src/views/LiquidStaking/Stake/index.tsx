import { CardBody, Text, Select, RowBetween, Button, OptionProps } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { AppHeader } from 'components/App'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useState, useCallback } from 'react'
import { JSBI, WETH9 } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { useWBETHContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'
import { useCurrency } from 'hooks/Tokens'
import { ExchangeRateTitle } from '../components/ExchangeRateTitle'

export function LiquidStakingPageStake() {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  // NOTE: default is ETH
  const [currencyAddress, setCurrencyAddress] = useState(WETH9[chainId]?.address)

  const handleSortOptionChange = useCallback((option: OptionProps) => setCurrencyAddress(option.value), [])

  const isETH = WETH9[chainId]?.address === currencyAddress

  const inputCurrency = useCurrency(currencyAddress)

  const wbethContract = useWBETHContract()

  const { data } = useSWRContract(wbethContract && [wbethContract, 'exchangeRate'])

  const decimals = inputCurrency?.decimals

  const rateNumber = data ? JSBI.divide(JSBI.BigInt(data.toString()), JSBI.BigInt(10 ** decimals)) : undefined

  return (
    <>
      <AppHeader subtitle={t('Unlock liquidity while earning rewards')} title={t('Liquid Staking')} noConfig />
      <CardBody>
        <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          {t('Choose a pair to liquid stake')}
        </Text>
        <Select
          mb="24px"
          options={[
            {
              label: 'ETH / wBETH',
              value: WETH9[chainId]?.address,
            },
          ]}
          onOptionChange={handleSortOptionChange}
        />
        <RowBetween mb="24px">
          <ExchangeRateTitle isETH={isETH} />

          {rateNumber ? (
            <Text>{isETH ? `${rateNumber?.toString()} ETH = 1 wBETH` : `${rateNumber} BNB = 1 sBNB`}</Text>
          ) : (
            '-'
          )}
        </RowBetween>
        <NextLink href={`/liquid-staking/${currencyAddress}`}>
          <Button width="100%">{t('Proceed')}</Button>
        </NextLink>
      </CardBody>
    </>
  )
}
