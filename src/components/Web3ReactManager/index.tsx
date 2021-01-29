import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'

import PageLoader from 'components/PageLoader'
import { network } from 'connectors'
import useEagerConnect from 'hooks/useEagerConnect'
import useInactiveListener from 'hooks/useInactiveListener'

// export const NetworkContextName = 'NETWORK'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.colors.primaryDark};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const t = useI18n()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
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
    console.log('network', networkError)
    return (
      <MessageWrapper>
        <Message>{t(999, 'unknownError')}</Message>
      </MessageWrapper>
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
