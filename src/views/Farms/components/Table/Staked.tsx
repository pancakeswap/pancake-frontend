import React from 'react'
import styled from 'styled-components'
import { Button } from '@pancakeswap-libs/uikit'

const ConnectWalletButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  border-width: 0;
  color: white;
  height: 2rem;
  width: 10rem;
  border-radius: 1rem;
  padding-left: 0;
  padding-right: 0;
`

const Staked: React.FunctionComponent = () => {
  return (
    <>
      <ConnectWalletButton>
        Connect Wallet
      </ConnectWalletButton>
    </>
  )
}

export default Staked