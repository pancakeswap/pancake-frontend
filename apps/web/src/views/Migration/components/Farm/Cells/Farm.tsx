import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'
import { FarmWithStakedValue } from '@pancakeswap/farms'

const StyledCell = styled(Pool.BaseCell)`
  flex: 0;
  margin-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 100px;
    margin-left: 30px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

export interface FarmProps extends FarmWithStakedValue {
  label: string
  pid: number
  token: Token
  quoteToken: Token
  lpSymbol: string
}

const Farm: React.FC<React.PropsWithChildren<FarmProps>> = ({ token, quoteToken, label }) => {
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex>
          <TokenWrapper>
            <TokenPairImage
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
              width={40}
              height={40}
            />
          </TokenWrapper>
          <Flex flexDirection="column" alignSelf="center">
            <Text bold>{label}</Text>
          </Flex>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Farm
