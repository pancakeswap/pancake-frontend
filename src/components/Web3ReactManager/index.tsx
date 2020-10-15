/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useWallet } from 'use-wallet'

export default function Web3ReactManager({
  children,
}: {
  children: JSX.Element
}) {
  const { account, connect } = useWallet()
  useEffect(() => {
    if (window.localStorage.getItem('accountStatus')) {
      if (!account) {
        connect('injected')
        window.localStorage.setItem('accountStatus', '1')
      }
    }
  }, [])

  return <>{children}</>
}
