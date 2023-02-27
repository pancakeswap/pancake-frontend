import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useState, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId, Currency } from '@pancakeswap/sdk'

import styled from 'styled-components'
import TokenTable from './SwapTokenTable'
import { useTokenHighLightList } from './useList'

const Wrapper = styled.div`
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 725px;
    padding: 24px;
    box-sizing: border-box;
    background: ${({ theme }) => (theme.isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 32px;
  }
`
const MenuWrapper = styled.div`
  padding: 0px 24px 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 24px;
  }
`

const LIQUIDITY_FILTER = { [ChainId.BSC]: 100000, [ChainId.ETHEREUM]: 50000 }

const HotTokenList: React.FC<{ handleOutputSelect: (newCurrencyOutput: Currency) => void }> = ({
  handleOutputSelect,
}) => {
  const { chainId } = useActiveChainId()
  const allTokens = useTokenHighLightList()
  const [index, setIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()
  const formattedTokens = useMemo(
    () =>
      allTokens.filter(
        (t) =>
          t.priceUSD !== 0 &&
          t.priceUSDChange !== 0 &&
          t.volumeUSD !== 0 &&
          t.liquidityUSD >= LIQUIDITY_FILTER[chainId],
      ),
    [allTokens, chainId],
  )

  const { t } = useTranslation()
  return (
    <Wrapper>
      <MenuWrapper>
        <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle">
          <ButtonMenuItem>{chainId === ChainId.BSC ? t('Price Change') : t('Liquidity')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Volume (24H)')}</ButtonMenuItem>
        </ButtonMenu>
      </MenuWrapper>
      {index === 0 ? (
        <TokenTable
          tokenDatas={formattedTokens}
          type={chainId === ChainId.BSC ? 'priceChange' : 'liquidity'}
          defaultSortField={chainId === ChainId.BSC ? 'priceUSDChange' : 'liquidityUSD'}
          maxItems={isMobile ? 100 : 6}
          handleOutputSelect={handleOutputSelect}
        />
      ) : (
        <TokenTable
          tokenDatas={formattedTokens}
          type="volume"
          defaultSortField="volumeUSD"
          maxItems={isMobile ? 100 : 6}
          handleOutputSelect={handleOutputSelect}
        />
      )}
    </Wrapper>
  )
}

export default memo(HotTokenList)
