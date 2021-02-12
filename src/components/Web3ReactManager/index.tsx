import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { UserRejectedRequestError, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import styled from 'styled-components'
import { ToastContainer } from '@pancakeswap-libs/uikit'

import PageLoader from 'components/PageLoader'
import { network } from 'connectors'
import useEagerConnect from 'hooks/useEagerConnect'
import useInactiveListener from 'hooks/useInactiveListener'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const [toasts, setToasts] = useState([])

  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
    chainId,
    library,
    account,
    connector,
  } = useWeb3React()
  if (connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider.on('disconnect', () => localStorage.removeItem('accountStatus'))
  }
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  const isUserRejectedRequestError = networkError instanceof UserRejectedRequestError
  if (isUserRejectedRequestError) {
    localStorage.removeItem('accountStatus')
  }

  if (triedEager && !networkActive && !networkError) {
    activateNetwork(network)
  }

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)
  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  if (library) window.library = library
  if (account) window.account = account
  if (chainId) window.chainId = chainId
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (networkError) {
    setToasts((prevToasts) => [
      {
        id: networkError.name,
        type: 'WARNING',
        title: networkError.message,
      },
      ...prevToasts,
    ])
    return (
      <>
        {children}
        <ToastContainer toasts={toasts} onRemove={handleRemove} />
      </>
    )
  }

  // if neither context is active, spin
  if (!networkActive) {
    return showLoader ? (
      <MessageWrapper>
        <PageLoader />
      </MessageWrapper>
    ) : null
  }

  return children
}
