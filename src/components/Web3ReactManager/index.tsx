import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { UserRejectedRequestError, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { toastTypes } from '@pancakeswap-libs/uikit'
import { push } from 'state/toasts'

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
  const dispatch = useDispatch()
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
    chainId,
    library,
    account,
    connector,
  } = useWeb3React()
  const triedEager = useEagerConnect()
  useInactiveListener(!triedEager)

  useEffect(() => {
    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider.on('disconnect', () => localStorage.removeItem('accountStatus'))
    }
    // try to eagerly connect to an injected provider, if it exists and has granted access already
    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    const isUserRejectedRequestError = networkError instanceof UserRejectedRequestError
    if (isUserRejectedRequestError) {
      localStorage.removeItem('accountStatus')
    }

    if (triedEager && !networkActive && !networkError) {
      activateNetwork(network)
    }

    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  }, [triedEager, connector, activateNetwork, networkActive, networkError])
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

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (networkError) {
    dispatch(push({ id: networkError.name, type: toastTypes.DANGER, title: networkError.message }))
    return <>{children}</>
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
