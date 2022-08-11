import React, { createContext, useState, useEffect } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

export const CanRegisterTokenContext = createContext<{ canRegisterToken: boolean }>({
  canRegisterToken: false,
})

export const CanRegisterTokenProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { library } = useActiveWeb3React()
  const [canRegisterToken, setCanRegisterToken] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setCanRegisterToken(false)
      return
    }
    window.ethereum
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: undefined,
            symbol: undefined,
            decimals: undefined,
          },
        },
      })
      .catch((err) => {
        if (err && err.code === -32601) {
          setCanRegisterToken(false)
        } else {
          setCanRegisterToken(true)
        }
      })
  }, [library])

  return <CanRegisterTokenContext.Provider value={{ canRegisterToken }}>{children}</CanRegisterTokenContext.Provider>
}
