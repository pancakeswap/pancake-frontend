import { FarmWithStakedValue } from '@pancakeswap/farms'
import React from 'react'
import { styled } from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 14px 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 14px 0 0;
    align-items: center;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 32px;
  }
`
export interface UnstakeProps {
  pid: number
  vaultPid?: number
  farm: FarmWithStakedValue
}

const Unstake: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Container>{children}</Container>
}

export default Unstake
