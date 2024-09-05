import { CHAIN_QUERY_NAME } from 'config/chains'
import { PERSIST_CHAIN_KEY } from 'config/constants'
import { useRouter } from 'next/router'
import { Protocol } from '@pancakeswap/farms'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { Column, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { TokenPairLogo } from 'components/TokenImage'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { addQueryToPath } from 'utils/addQueryToPath'
import { PositionInfo } from './PositionInfo'
import { PositionItemSkeleton } from './PositionItemSkeleton'
import { Container } from './styled'

type PositionItemProps = {
  chainId: number
  currency0?: Currency
  currency1?: Currency
  removed: boolean
  outOfRange: boolean
  desc?: React.ReactNode
  link?: string
  tokenId?: bigint
  fee: number
  feeTierBase?: number
  isStaked?: boolean
  protocol: Protocol
  totalPriceUSD: number
  amount0?: CurrencyAmount<Token>
  amount1?: CurrencyAmount<Token>
  pool?: PoolInfo | null
  detailMode?: boolean
  userPosition?: PositionDetail | V2LPDetail | StableLPDetail
}
export const PositionItem: React.FC<PropsWithChildren<PositionItemProps>> = (props) => {
  const { link, currency0, currency1, chainId, children } = props

  const router = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const linkWithChain = useMemo(
    () =>
      link
        ? addQueryToPath(link, {
            chain: CHAIN_QUERY_NAME[chainId],
            [PERSIST_CHAIN_KEY]: '1',
          })
        : link,
    [link, chainId],
  )
  const handleItemClick = useCallback(() => {
    if (!linkWithChain) {
      return
    }
    router.push(linkWithChain)
  }, [router, linkWithChain])

  if (!(currency0 && currency1)) {
    return <PositionItemSkeleton />
  }

  const content = (
    <Container>
      {isDesktop && (
        <TokenPairLogo
          width={48}
          height={48}
          variant="inverted"
          primaryToken={currency0}
          secondaryToken={currency1.wrapped}
          withChainLogo
        />
      )}
      <DetailsContainer>
        <Column gap="8px">
          <PositionInfo {...props} />
        </Column>
        <Column justifyContent="flex-end">{children}</Column>
      </DetailsContainer>
    </Container>
  )

  if (!linkWithChain) {
    return content
  }
  return (
    <div
      onClick={handleItemClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleItemClick()
        }
      }}
    >
      {content}
    </div>
  )
}

const DetailsContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSubtle};

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
