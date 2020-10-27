import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, connect, status } = useWallet()

  useEffect(() => {
    if (account) {
      onDismiss()
    }
  }, [account, onDismiss])

  return (
    <Modal>
      <ModalContent>
        <StyledWalletsWrapper>
          <StyledWalletCard>
            <WalletCard
              icon={
                <img
                  src="/images/metamask-fox.svg"
                  style={{ height: 52 }}
                  alt="metamask logo"
                />
              }
              onConnect={() => {
                connect('injected')
                window.localStorage.setItem('accountStatus', '1')
              }}
              title="Metamask"
            />
          </StyledWalletCard>
          <Spacer size="sm" />
          <StyledWalletCard>
            <WalletCard
              icon={
                <img
                  src="/images/trustwallet.svg"
                  style={{ height: 52 }}
                  alt="trust wallet logo"
                />
              }
              onConnect={() => {
                console.log('ddd')
                connect('injected')
                window.localStorage.setItem('accountStatus', '1')
              }}
              title="Trust Wallet"
            />
          </StyledWalletCard>
          <Spacer size="sm" />
          <StyledWalletCard>
            <WalletCard
              icon={
                <img
                  src="/images/tokenpocket.svg"
                  style={{ height: 52 }}
                  alt="token pocket logo"
                />
              }
              onConnect={() => {
                connect('injected')
                window.localStorage.setItem('accountStatus', '1')
              }}
              title="TokenPocket"
            />
          </StyledWalletCard>
          <Spacer size="sm" />
          <StyledWalletCard>
            <WalletCard
              icon={
                <img
                  src="/images/wallet-connect.svg"
                  style={{ height: 44 }}
                  alt="wallet connect logo"
                />
              }
              onConnect={() => {
                connect('walletconnect')
                window.localStorage.setItem('accountStatus', '1')
              }}
              title="WalletConnect"
            />
          </StyledWalletCard>
        </StyledWalletsWrapper>
      </ModalContent>
    </Modal>
  )
}

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
    flex-wrap: none;
  }
`

const StyledWalletCard = styled.div`
  flex-basis: calc(100%);
  padding: 0.1em;
`

export default WalletProviderModal
