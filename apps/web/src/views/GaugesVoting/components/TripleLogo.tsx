import { Token } from '@pancakeswap/sdk'
import { Box } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { useMemo } from 'react'
import styled from 'styled-components'
import { safeGetAddress } from 'utils'
import { Address } from 'viem'

const StyledDualLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
`

export const TripleLogo: React.FC<{
  address0?: Address
  address1?: Address
  chainId?: number
}> = ({ address0, address1, chainId }) => {
  const currency0 = useMemo(() => {
    return chainId && safeGetAddress(address0) ? new Token(chainId, safeGetAddress(address0)!, 18, '') : undefined
  }, [address0, chainId])
  const currency1 = useMemo(() => {
    return chainId && safeGetAddress(address1) ? new Token(chainId, safeGetAddress(address1)!, 18, '') : undefined
  }, [address1, chainId])
  return (
    <StyledDualLogo>
      {currency0 ? (
        <Box mr="-5.62px">
          <CurrencyLogo currency={currency0} size="36px" />
        </Box>
      ) : null}
      {currency1 ? <CurrencyLogo currency={currency1} size="36px" /> : null}
      {chainId ? (
        <Box ml="-9px">
          <ChainLogo chainId={chainId} />
        </Box>
      ) : null}
    </StyledDualLogo>
  )
}
