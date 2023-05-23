import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { Flex, Checkbox, Text, ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useState, useMemo, useEffect } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId, Currency } from '@pancakeswap/sdk'

import styled from 'styled-components'
import TokenTable from './SwapTokenTable'
import { useTokenHighLightList } from './useList'
import useTradingRewardTokenList from '../../hooks/useTradingRewardTokenList'

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
    padding: 0px 0px 12px;
    margin-bottom: 24px;
  }
`

const LIQUIDITY_FILTER = { [ChainId.BSC]: 100000, [ChainId.ETHEREUM]: 50000 }

const HotTokenList: React.FC<{ handleOutputSelect: (newCurrencyOutput: Currency) => void }> = ({
  handleOutputSelect,
}) => {
  const { query } = useRouter()
  const { chainId } = useActiveChainId()
  const allTokens = useTokenHighLightList()
  const [index, setIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()
  const [confirmed, setConfirmed] = useState(false)
  const { tokenPairs } = useTradingRewardTokenList()

  useEffect(() => {
    if (query.showTradingReward) {
      setConfirmed(true)
    }
  }, [query, setConfirmed])

  const formattedTokens = useMemo(
    () =>
      allTokens
        .filter(
          (t) =>
            t.priceUSD !== 0 &&
            t.priceUSDChange !== 0 &&
            t.volumeUSD !== 0 &&
            t.liquidityUSD >= LIQUIDITY_FILTER[chainId],
        )
        .map((i) => {
          const tokenAddress = i?.address?.toLowerCase()
          const pairs = tokenPairs?.filter(
            (pair) =>
              pair?.token?.address?.toLowerCase() === tokenAddress ||
              pair?.quoteToken?.address?.toLowerCase() === tokenAddress,
          )
          return {
            ...i,
            pairs,
          }
        }),
    [allTokens, chainId, tokenPairs],
  )

  const filterFormattedTokens = useMemo(() => {
    if (confirmed) {
      return formattedTokens.filter((token) => token.pairs.length > 0)
    }
    return formattedTokens
  }, [confirmed, formattedTokens])

  const { t } = useTranslation()
  return (
    <Wrapper>
      <MenuWrapper>
        <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle">
          <ButtonMenuItem>{chainId === ChainId.BSC ? t('Price Change') : t('Liquidity')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Volume (24H)')}</ButtonMenuItem>
        </ButtonMenu>
      </MenuWrapper>
      <Flex
        mb="24px"
        alignItems="center"
        ml={['20px', '20px', '20px', '20px', '-4px']}
        onClick={() => setConfirmed(!confirmed)}
        style={{ cursor: 'pointer' }}
      >
        <Checkbox
          scale="sm"
          name="confirmed"
          type="checkbox"
          checked={confirmed}
          onChange={() => setConfirmed(!confirmed)}
        />
        <Text ml="8px" style={{ userSelect: 'none' }}>
          {t('Show pairs with trading rewards')}
        </Text>
      </Flex>
      {index === 0 ? (
        <TokenTable
          tokenDatas={filterFormattedTokens}
          type={chainId === ChainId.BSC ? 'priceChange' : 'liquidity'}
          defaultSortField={chainId === ChainId.BSC ? 'priceUSDChange' : 'liquidityUSD'}
          maxItems={isMobile ? 100 : 6}
          handleOutputSelect={handleOutputSelect}
        />
      ) : (
        <TokenTable
          tokenDatas={filterFormattedTokens}
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
