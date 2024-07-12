import { Flex } from '@pancakeswap/uikit'
import { NetworkFilter, PoolTypeMenu, TokenFilter } from '@pancakeswap/widgets-internal'
import styled from 'styled-components'
import { CHAINS } from 'config/chains'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'

const PoolsFilterContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
`
const chains = CHAINS.filter((chain) => {
  if ('testnet' in chain && chain.testnet) {
    return false
  }
  return true
}).map((chain) => ({
  icon: `${ASSET_CDN}/web/chains/${chain.id}.png`,
  value: chain.id,
  label: chain.name,
}))

export const PoolsFilterPanel = () => {
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
  const [selectedNetwork, setSelectedNetwork] = useState(chains.map((i) => i.value))
  const [selectedTokens, setSelectedTokens] = useState()

  const { t } = useTranslation()
  const poolTypes = useMemo(() => [t('All'), 'V3', 'V2', t('StableSwap')], [t])

  const allTokens = useAllTokensByChainIds(selectedNetwork)
  const sortedTokens = useMemo(
    () =>
      // todo:@eric confirm the sort logic
      Object.values(allTokens),
    [allTokens],
  )

  return (
    <PoolsFilterContainer>
      <NetworkFilter data={chains} value={selectedNetwork} onChange={setSelectedNetwork} />
      <TokenFilter data={sortedTokens} value={selectedTokens} onChange={(e) => setSelectedTokens(e.value)} />
      <PoolTypeMenu data={poolTypes} activeIndex={selectedTypeIndex} onChange={setSelectedTypeIndex} />
    </PoolsFilterContainer>
  )
}
