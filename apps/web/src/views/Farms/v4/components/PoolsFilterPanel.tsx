import { Flex } from '@pancakeswap/uikit'
import {
  INetworkProps,
  IPoolTypeMenuProps,
  ITokenProps,
  NetworkFilter,
  PoolTypeMenu,
  TokenFilter,
} from '@pancakeswap/widgets-internal'
import styled from 'styled-components'
import { CHAINS } from 'config/chains'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { getChainNameInKebabCase } from '@pancakeswap/chains'

const PoolsFilterContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
`
export const MAINNET_CHAINS = CHAINS.filter((chain) => {
  if ('testnet' in chain && chain.testnet) {
    return false
  }
  return true
})

export const useAllChainsName = () => {
  return useMemo(() => MAINNET_CHAINS.map((chain) => getChainNameInKebabCase(chain.id)), [])
}

const chainsOpts = MAINNET_CHAINS.map((chain) => ({
  icon: `${ASSET_CDN}/web/chains/${chain.id}.png`,
  value: chain.id,
  label: chain.name,
}))

export const usePoolTypes = () => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      {
        label: t('All'),
        value: '',
      },
      {
        label: 'V3',
        value: 'v3',
      },
      {
        label: 'V2',
        value: 'v2',
      },
      {
        label: t('StableSwap'),
        value: 'stable',
      },
    ],
    [t],
  )
}

export const useSelectedPoolTypes = (selectedIndex: number) => {
  const allTypes = usePoolTypes()
  return useMemo(() => {
    if (selectedIndex === 0) {
      return allTypes.slice(1).map((t) => t.value)
    }
    return [allTypes[selectedIndex].value]
  }, [selectedIndex, allTypes])
}

export interface IPoolsFilterPanelProps {
  value: {
    selectedTypeIndex: IPoolTypeMenuProps['activeIndex']
    selectedNetwork: INetworkProps['value']
    selectedTokens: ITokenProps['value']
  }
  onChange: (value: Partial<IPoolsFilterPanelProps['value']>) => void
}
export const PoolsFilterPanel = ({ value, onChange }: IPoolsFilterPanelProps) => {
  const { selectedTokens, selectedNetwork, selectedTypeIndex: selectedType } = value

  const allTokens = useAllTokensByChainIds(selectedNetwork)
  const sortedTokens = useMemo(
    () =>
      // todo:@eric confirm the sort logic
      Object.values(allTokens),
    [allTokens],
  )

  const handleTypeIndexChange: IPoolTypeMenuProps['onChange'] = (index) => {
    onChange({ selectedTypeIndex: index })
  }

  const handleNetworkChange: INetworkProps['onChange'] = (network) => {
    onChange({ selectedNetwork: network })
  }

  const handleTokensChange: ITokenProps['onChange'] = (e) => {
    onChange({ selectedTokens: e.value })
  }

  return (
    <PoolsFilterContainer>
      <NetworkFilter data={chainsOpts} value={selectedNetwork} onChange={handleNetworkChange} />
      <TokenFilter data={sortedTokens} value={selectedTokens} onChange={handleTokensChange} />
      <PoolTypeMenu data={usePoolTypes()} activeIndex={selectedType} onChange={handleTypeIndexChange} />
    </PoolsFilterContainer>
  )
}
