import { CardBody, Text, Select, RowBetween, Button, OptionProps } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { AppHeader } from 'components/App'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useState, useCallback, useEffect } from 'react'
import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { useWBETHContract } from 'hooks/useContract'
import { useCurrency } from 'hooks/Tokens'
import { useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'

import { ExchangeRateTitle } from '../components/ExchangeRateTitle'
import { LiquidStakingApr } from '../components/LiquidStakingApr'

export function LiquidStakingPageStake() {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  const eth = [ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? NATIVE[chainId] : WETH9[chainId]

  // NOTE: default is ETH
  const [selectedSymbol, setSymbol] = useState(eth?.symbol)

  const handleSortOptionChange = useCallback((option: OptionProps) => setSymbol(option.value), [])

  const inputCurrency = useCurrency(eth?.address || eth?.symbol)

  const wbethContract = useWBETHContract()

  const { data } = useContractRead({
    // @ts-ignore
    abi: wbethContract.abi,
    address: wbethContract.address,
    enabled: !!wbethContract,
    functionName: 'exchangeRate',
    chainId,
  })

  useEffect(() => {
    setSymbol(eth?.symbol)
  }, [chainId, eth?.symbol])

  const decimals = inputCurrency?.decimals

  const rateNumber: BigNumber | undefined = data
    ? new BigNumber(data.toString()).dividedBy(new BigNumber(10 ** decimals))
    : undefined

  const exchangeRateAmount = rateNumber ? new BigNumber('1').dividedBy(rateNumber.toString()) : undefined

  return (
    <>
      <AppHeader
        shouldCenter
        subtitle={t('Unlock liquidity while earning rewards')}
        title={t('Liquid Staking')}
        noConfig
      />
      <CardBody>
        <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          {t('Choose a pair to liquid stake')}
        </Text>
        <Select
          mb="24px"
          options={[
            {
              label: 'ETH / WBETH',
              value: WETH9[chainId]?.symbol,
            },
          ]}
          onOptionChange={handleSortOptionChange}
        />
        <RowBetween mb="8px">
          <ExchangeRateTitle />

          {exchangeRateAmount ? <Text>{`1 ETH = ${getFullDisplayBalance(exchangeRateAmount, 0, 6)} WBETH`}</Text> : '-'}
        </RowBetween>

        <LiquidStakingApr />
        <NextLink href={`/liquid-staking/${selectedSymbol}`}>
          <Button width="100%">{t('Proceed')}</Button>
        </NextLink>
      </CardBody>
    </>
  )
}
