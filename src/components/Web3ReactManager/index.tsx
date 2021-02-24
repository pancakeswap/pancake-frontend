import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import useEagerConnect from 'hooks/useEagerConnect'
import useInactiveListener from 'hooks/useInactiveListener'
import PageLoader from 'components/PageLoader'
import { network } from 'connectors'

const Web3ReactManager = ({ children }: { children: JSX.Element }) => {
  const { active, error, activate, connector } = useWeb3React()

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !error && !active) {
      activate(network)
    }
  }, [triedEager, error, activate, active])

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

  console.log(active, error, connector)
  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && error) {
    return null
    // return (
    //   <MessageWrapper>
    //     <Message>{t('unknownError')}</Message>
    //   </MessageWrapper>
    // )
  }

  // if neither context is active, spin
  if (!active && !error) {
    return showLoader ? <PageLoader /> : null
  }

  return children
}

export default Web3ReactManager
