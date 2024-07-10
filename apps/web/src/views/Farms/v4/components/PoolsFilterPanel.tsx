import { ButtonMenu, ButtonMenuItem, Flex } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import styled from 'styled-components'
import { CHAINS } from 'config/chains'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useAllTokensByChainIds } from 'hooks/Tokens'
import { useMemo, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'

const PoolsHeader = styled(Flex)`
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 30px;
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

interface IPoolTypeMenuProps {
  activeIndex: number
  onChange: (index: number) => void
}

export const PoolTypeMenu: React.FC<IPoolTypeMenuProps> = ({ activeIndex, onChange }) => {
  const { t } = useTranslation()
  const poolTypes = useMemo(() => [t('All'), 'V3', 'V2', t('StableSwap')], [t])

  return (
    <ButtonMenu scale="sm" activeIndex={activeIndex} onItemClick={onChange} variant="subtle">
      {poolTypes.map((type) => (
        <ButtonMenuItem key={type} height="38px">
          {type}
        </ButtonMenuItem>
      ))}
    </ButtonMenu>
  )
}

export const PoolsFilterPanel = () => {
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0)
  const [selectedNetwork, setSelectedNetwork] = useState(chains.map((i) => i.value))
  const [selectedTokens, setSelectedTokens] = useState()

  const allTokens = useAllTokensByChainIds(selectedNetwork)
  const sortedTokens = useMemo(
    () =>
      // todo:@eric confirm the sort logic
      Object.values(allTokens),
    [allTokens],
  )

  return (
    <PoolsHeader>
      <FarmWidget.NetworkFilter data={chains} value={selectedNetwork} onChange={setSelectedNetwork} />
      <FarmWidget.TokenFilter data={sortedTokens} value={selectedTokens} onChange={(e) => setSelectedTokens(e.value)} />
      <PoolTypeMenu activeIndex={selectedTypeIndex} onChange={setSelectedTypeIndex} />
    </PoolsHeader>
  )
}
