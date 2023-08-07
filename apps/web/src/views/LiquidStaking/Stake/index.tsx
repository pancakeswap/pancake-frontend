import { useState, useCallback, useEffect, useMemo } from 'react'
import NextLink from 'next/link'
import { CardBody, Text, Select, Button } from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import StakeInfo from 'views/LiquidStaking/components/StakeInfo'

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
      value: liquidStakingList?.[0]?.contract ?? '',
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
        value: i.contract,
      })) ?? []
    )
  }, [liquidStakingList])

  const handleSortOptionChange = useCallback((option) => setSelectedList(option), [])

  useEffect(() => {
    if (initState) {
      setSelectedList(initState)
    }
  }, [chainId, initState])

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
        <StakeInfo selectedList={selectedList} />
        <NextLink href={`/liquid-staking/${selectedList?.contract}`}>
          <Button width="100%">{t('Proceed')}</Button>
        </NextLink>
      </CardBody>
    </>
  )
}
