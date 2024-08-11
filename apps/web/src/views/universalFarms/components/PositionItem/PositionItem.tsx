import { chainNames } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { Column, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import NextLink from 'next/link'
import { useMemo } from 'react'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { addQueryToPath } from '../../utils'
import { PositionInfo } from './PositionInfo'
import { PositionItemSkeleton } from './PositionItemSkeleton'
import { Container } from './styled'

type PositionItemProps = {
  data: PositionDetail | V2LPDetail | StableLPDetail
  chainId: number
  currency0?: Currency
  currency1?: Currency
  removed: boolean
  outOfRange: boolean
  desc?: React.ReactNode
  link?: string
  tokenId?: bigint
  fee: number
  isStaked?: boolean
  protocol: Protocol
  totalPriceUSD: number
  amount0?: CurrencyAmount<Token>
  amount1?: CurrencyAmount<Token>
  pool?: PoolInfo | null
  detailMode?: boolean
}
export const PositionItem = (props: PositionItemProps) => {
  const { link, currency0, currency1, removed, outOfRange, tokenId, isStaked, detailMode, chainId } = props

  const { isDesktop } = useMatchBreakpoints()
  const linkWithChain = useMemo(
    () => (link ? addQueryToPath(link, { chain: chainNames[chainId] }) : link),
    [link, chainId],
  )

  if (!(currency0 && currency1)) {
    return <PositionItemSkeleton />
  }

  const content = (
    <Container>
      {isDesktop && (
        <TokenPairImage
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
        <Column justifyContent="flex-end">
          {/* <ModifyStakeActions /> */}
          {/* <ActionPanel
            currency0={currency0}
            currency1={currency1}
            isStaked={isStaked}
            protocol={props.protocol}
            fee={props.fee}
            removed={removed}
            tokenId={tokenId}
            outOfRange={outOfRange}
            modalContent={<V3UnstakeModalContent {...props} />}
            detailMode={detailMode}
          /> */}
        </Column>
      </DetailsContainer>
    </Container>
  )

  if (!linkWithChain) {
    return content
  }
  return <NextLink href={linkWithChain}>{content}</NextLink>
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
