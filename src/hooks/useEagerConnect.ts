import { useEffect, useState } from 'react'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { injected } from 'connectors'

function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      const hasSignedIn = window.localStorage.getItem('accountStatus')
      if (isAuthorized && hasSignedIn) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [active, activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

export default useEagerConnect
