import { ChainId } from '@pancakeswap/sdk'
import Image from 'next/image'
import { memo, useMemo } from 'react'
import { Box, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

import { useChainName } from '../hooks/useChainNames'

const BACKGROUND = {
  [ChainId.POLYGON_ZKEVM]: 'linear-gradient(180deg, #9132D2 0%, #803DE1 100%)',
  [ChainId.BSC]: '#D8A70A',
  [ChainId.ETHEREUM]: '#627AD8',
}

const Container = styled(Box)`
  width: 100%;
`

const Tag = styled(Box)`
  position: absolute;
  top: 0;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  padding: 0.25rem 0.75rem;
  border-radius: 2.75rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    top: 2rem;
    right: 1.625rem;
    transform: translateX(100%);
  }
`

type Props = {
  chainId?: ChainId
}

export const IfoChainBoard = memo(function IfoChainBoard({ chainId }: Props) {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const boardImageUrl = useMemo(() => `/images/ifos/chain-board/${chainId}.png`, [chainId])
  const chainName = useChainName(chainId, { shortName: true })

  if (!chainId) {
    return null
  }

  return (
    <Container>
      {!isMobile && <Image alt={`chain-${chainId}`} src={boardImageUrl} width={100} height={85} />}
      <Tag background={BACKGROUND[chainId]}>
        <Text fontSize="0.875rem" bold color="contrast">
          {t('On %chainName%', { chainName })}
        </Text>
      </Tag>
    </Container>
  )
})
