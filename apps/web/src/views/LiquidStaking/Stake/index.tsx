import { CardBody, Text, Select, RowBetween, Button } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { AppHeader } from 'components/App'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useWBETHContract } from 'hooks/useContract'
import { useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

import { ExchangeRateTitle } from '../components/ExchangeRateTitle'
import { LiquidStakingApr } from '../components/LiquidStakingApr'

interface OptionProps extends LiquidStakingList {
  label: string
  value: string
}

export function LiquidStakingPageStake() {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const liquidStakingList = useLiquidStakingList()

  const initState = useMemo(
    () => ({
      ...liquidStakingList?.[0],
      label: liquidStakingList?.[0]?.stakingSymbol ?? '',
      value: liquidStakingList?.[0]?.symbol ?? '',
    }),
    [liquidStakingList],
  )

  // NOTE: default is ETH
  const [selectedList, setSelectedList] = useState<OptionProps>(initState)

  const optionsList = useMemo(() => {
    return (
      liquidStakingList?.map((i) => ({
        ...i,
        label: i.stakingSymbol,
        value: i.symbol,
      })) ?? []
    )
  }, [liquidStakingList])

  const handleSortOptionChange = useCallback((option) => setSelectedList(option), [])

  const wbethContract = useWBETHContract()

  const { data } = useContractRead({
    // @ts-ignore
    abi: wbethContract?.abi,
    address: wbethContract?.address,
    enabled: !!wbethContract,
    functionName: 'exchangeRate',
    chainId,
  })

  useEffect(() => {
    if (initState) {
      setSelectedList(initState)
    }
  }, [chainId, initState])

  const rateNumber: BigNumber | undefined = data
    ? new BigNumber(data.toString()).dividedBy(new BigNumber(10 ** selectedList?.token0?.decimals))
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
        {optionsList.length > 0 && <Select mb="24px" options={optionsList} onOptionChange={handleSortOptionChange} />}
        <RowBetween mb="8px">
          <ExchangeRateTitle />

          {exchangeRateAmount && (
            <Text>
              {t('1 %token0% = %exchangeRateAmount% %token1%', {
                token0: selectedList?.token0?.symbol,
                token1: selectedList?.token1?.symbol,
                exchangeRateAmount: getFullDisplayBalance(exchangeRateAmount, 0, 6),
              })}
            </Text>
          )}
        </RowBetween>

        <LiquidStakingApr />
        <NextLink href={`/liquid-staking/${selectedList?.symbol}`}>
          <Button width="100%">{t('Proceed')}</Button>
        </NextLink>
      </CardBody>
    </>
  )
}
