import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { ButtonMenu, ButtonMenuItem, Checkbox, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { memo, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { TabToggle, TabToggleGroup } from 'components/TabToggle'
import { InfoDataSource as DataSourceType } from 'state/info/types'

import useTradingRewardTokenList from '../../hooks/useTradingRewardTokenList'
import TokenTable from './SwapTokenTable'
import { useTokenHighLightList } from './useList'

const StyledFlex = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
  border-radius: 32px;
  > div:first-child {
    min-height: 56px;
  }
  > div:first-child > div {
    background: ${({ theme }) => (theme.isDark ? `rgba(55, 47, 71,0.5)` : `rgba(238, 234, 244, 0.5)`)};
    overflow: hidden;
  }
`

const StyledTabToggle = styled(TabToggle)`
  cursor: pointer;
  background-color: ${({ theme, isActive }) =>
    isActive ? (theme.isDark ? 'rgb(45,48,72)' : '#ffffff') : 'transparent'};
  ${({ theme }) => theme.mediaQueries.sm} {
    background-color: ${({ theme, isActive }) =>
      isActive ? (theme.isDark ? 'rgb(45,48,72)' : '#f4fdff') : 'transparent'};
  }
`

const Wrapper = styled.div`
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 725px;
    padding: 24px;
    box-sizing: border-box;
    background: ${({ theme }) => (theme.isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
    border-top: none;
    border-radius: 0px 0px 32px 32px;
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
  const { v2Tokens, v3Tokens } = useTokenHighLightList()
  const [dataSource, setDataSource] = useState(DataSourceType.V3)
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
      v2Tokens
        .filter(
          (t) =>
            t.priceUSD !== 0 && t.priceUSDChange !== 0 && t.volumeUSD !== 0 && t.tvlUSD >= LIQUIDITY_FILTER[chainId],
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
    [v2Tokens, chainId, tokenPairs],
  )

  const formattedV3Tokens = useMemo(
    () =>
      v3Tokens
        .filter(
          (t) =>
            t.priceUSD !== 0 && t.priceUSDChange !== 0 && t.volumeUSD !== 0 && t.tvlUSD >= LIQUIDITY_FILTER[chainId],
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
    [v3Tokens, chainId, tokenPairs],
  )

  const filterFormattedV3Tokens = useMemo(() => {
    if (confirmed) {
      return formattedV3Tokens.filter((token) => token.pairs.length > 0)
    }
    return formattedV3Tokens
  }, [confirmed, formattedV3Tokens])

  const { t } = useTranslation()
  return (
    <StyledFlex flexDirection="column">
      <TabToggleGroup>
        <StyledTabToggle isActive={dataSource === DataSourceType.V3} onClick={() => setDataSource(DataSourceType.V3)}>
          {t('V3')}
        </StyledTabToggle>
        <StyledTabToggle isActive={dataSource === DataSourceType.V2} onClick={() => setDataSource(DataSourceType.V2)}>
          {t('V2')}
        </StyledTabToggle>
      </TabToggleGroup>
      <Wrapper>
        <MenuWrapper>
          <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle">
            <ButtonMenuItem>{chainId === ChainId.BSC ? t('Price Change') : t('Liquidity')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Volume (24H)')}</ButtonMenuItem>
          </ButtonMenu>
        </MenuWrapper>
        {dataSource === DataSourceType.V3 && tokenPairs.length > 0 && (
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
        )}
        {index === 0 ? (
          <TokenTable
            dataSource={dataSource}
            tokenDatas={dataSource === DataSourceType.V3 ? filterFormattedV3Tokens : formattedTokens}
            type={chainId === ChainId.BSC ? 'priceChange' : 'liquidity'}
            defaultSortField={chainId === ChainId.BSC ? 'priceUSDChange' : 'liquidityUSD'}
            maxItems={isMobile ? 100 : 6}
            handleOutputSelect={handleOutputSelect}
          />
        ) : (
          <TokenTable
            dataSource={dataSource}
            tokenDatas={dataSource === DataSourceType.V3 ? filterFormattedV3Tokens : formattedTokens}
            type="volume"
            defaultSortField="volumeUSD"
            maxItems={isMobile ? 100 : 6}
            handleOutputSelect={handleOutputSelect}
          />
        )}
      </Wrapper>
    </StyledFlex>
  )
}

export default memo(HotTokenList)
