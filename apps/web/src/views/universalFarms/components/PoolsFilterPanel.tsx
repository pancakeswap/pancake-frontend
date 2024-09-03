import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import {
  INetworkProps,
  IPoolTypeMenuProps,
  ITokenProps,
  NetworkFilter,
  PoolTypeMenu,
  TokenFilter,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import isEmpty from 'lodash/isEmpty'
import React, { useMemo } from 'react'
import { UpdaterByChainId } from 'state/lists/updater'
import styled from 'styled-components'
import { getChainFullName } from '../utils'
import { MAINNET_CHAINS } from '../hooks/useMultiChains'
import { useMultiChainsTokens } from '../hooks/useMultiChainsTokens'

const PoolsFilterContainer = styled(Flex)<{ $childrenCount: number }>`
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;

  & > div {
    flex: 1;
  }

  & > div:nth-child(1),
  & > div:nth-child(2) {
    width: calc(${({ $childrenCount: $childCount }) => `${100 / $childCount}%`} - 16px);
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
    & > div:nth-child(3),
    & > div:nth-child(4) {
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
    if (selectedIndex === 0 || selectedIndex > allTypes.length - 1) {
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
export const PoolsFilterPanel: React.FC<React.PropsWithChildren<IPoolsFilterPanelProps>> = ({
  value,
  children,
  onChange,
}) => {
  const { chainId: activeChainId } = useActiveChainId()
  const { selectedTokens, selectedNetwork, selectedTypeIndex: selectedType } = value

  const allTokens = useMultiChainsTokens()
  const filteredTokens = useMemo(
    () => allTokens.filter((token) => selectedNetwork.includes(token.chainId)),
    [selectedNetwork, allTokens],
  )

  const handleTypeIndexChange: IPoolTypeMenuProps['onChange'] = (index) => {
    onChange({ selectedTypeIndex: index })
  }

  const handleNetworkChange: INetworkProps['onChange'] = (network, e) => {
    if (isEmpty(e.value)) {
      e.preventDefault()
      onChange({ selectedNetwork: [activeChainId] })
    } else {
      onChange({ selectedNetwork: network })
    }
  }

  const handleTokensChange: ITokenProps['onChange'] = (e) => {
    onChange({ selectedTokens: e.value })
  }

  const childrenCount = useMemo(() => 3 + React.Children.count(children), [children])

  return (
    <>
      {MAINNET_CHAINS.map((c) => (
        <UpdaterByChainId key={c.id} chainId={c.id} />
      ))}
      <PoolsFilterContainer $childrenCount={childrenCount}>
        <NetworkFilter data={chainsOpts} value={selectedNetwork} onChange={handleNetworkChange} />
        <TokenFilter
          data={filteredTokens}
          value={selectedTokens}
          onChange={handleTokensChange}
          getChainName={getChainFullName}
        />
        <PoolTypeMenu data={usePoolTypes()} activeIndex={selectedType} onChange={handleTypeIndexChange} />
        {children}
      </PoolsFilterContainer>
    </>
  )
}
