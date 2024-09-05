import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useEffect, useMemo, useRef } from 'react'
import { checkIsStableSwap } from 'state/info/constant'
import { useAllTokenDataQuery, useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import { TokenData } from 'state/info/types'
import { styled } from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import Percent from 'views/Info/components/Percent'

const CardWrapper = styled(NextLinkFromReactRouter)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const TopMoverCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 16px;
`

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const stableSwapQuery = checkIsStableSwap() ? '?type=stableSwap' : ''
  return (
    <CardWrapper to={`/info${chainPath}/tokens/${tokenData.address}${stableSwapQuery}`}>
      <TopMoverCard>
        <Flex>
          <Box width="32px" height="32px">
            {/* wrapped in a box because of alignment issues between img and svg */}
            <CurrencyLogo address={tokenData.address} size="32px" chainName={chainName} />
          </Box>
          <Box ml="16px">
            <Text>{tokenData.symbol}</Text>
            <Flex alignItems="center">
              <Text fontSize="14px" mr="6px" lineHeight="16px">
                ${formatAmount(tokenData.priceUSD)}
              </Text>
              <Percent fontSize="14px" value={tokenData.priceUSDChange} />
            </Flex>
          </Box>
        </Flex>
      </TopMoverCard>
    </CardWrapper>
  )
}

const TopTokenMovers: React.FC<React.PropsWithChildren> = () => {
  const allTokens = useAllTokenDataQuery()
  const { t } = useTranslation()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        // eslint-disable-next-line no-nested-ternary
        return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
      })
      .slice(0, Math.min(20, Object.values(allTokens).length))
      .filter((d) => d?.data?.exists)
  }, [allTokens])

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  if (topPriceIncrease.length === 0 || !topPriceIncrease.some((entry) => entry.data)) {
    return null
  }

  return (
    <Card my="16px">
      <Text ml="16px" mt="8px">
        {t('Top Movers')}
      </Text>
      <ScrollableRow ref={increaseRef}>
        {topPriceIncrease.map((entry) =>
          entry.data ? <DataCard key={`top-card-token-${entry.data?.address}`} tokenData={entry.data} /> : null,
        )}
      </ScrollableRow>
    </Card>
  )
}

export default TopTokenMovers
