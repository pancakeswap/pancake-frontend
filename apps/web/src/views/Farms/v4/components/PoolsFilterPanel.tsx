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
import { Protocol } from '@pancakeswap/farms'

const PoolsFilterContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;

  & > div {
    flex: 1;
    max-width: calc(33% - 16px);
  }

  @media (min-width: 1200px) {
    & {
      flex-wrap: nowrap;
    }
  }

  @media (max-width: 1199px) {
    & > div {
      flex: 0 0 calc(50% - 16px);
      max-width: calc(50% - 16px);
    }
  }

  @media (max-width: 967px) {
    & > div:nth-child(3) {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media (max-width: 575px) {
    & > div {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
`
export const MAINNET_CHAINS = CHAINS.filter((chain) => {
  if ('testnet' in chain && chain.testnet) {
    return false
  }
  return true
})

export const useSelectedChainsName = (chainIds: number[]) => {
  return useMemo(() => chainIds.map((id) => getChainNameInKebabCase(id)), [chainIds])
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
        value: null,
      },
      {
        label: 'V3',
        value: Protocol.V3,
      },
      {
        label: 'V2',
        value: Protocol.V2,
      },
      {
        label: t('StableSwap'),
        value: Protocol.STABLE,
      },
    ],
    [t],
  )
}

export const useSelectedPoolTypes = (selectedIndex: number): Protocol[] => {
  const allTypes = usePoolTypes()
  return useMemo(() => {
    if (selectedIndex === 0) {
      return allTypes.slice(1).map((t) => t.value) as unknown as Protocol[]
    }
    return [allTypes[selectedIndex].value] as unknown as Protocol[]
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
