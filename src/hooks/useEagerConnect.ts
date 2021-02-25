import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { connectorsByName } from 'utils/web3React'

const { injected } = connectorsByName

const useEagerConnect = () => {
  const { activate } = useWeb3React()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      const hasSignedIn = window.localStorage.getItem('accountStatus')
      if (isAuthorized && hasSignedIn) {
        activate(injected, undefined, true)
      }
    })
  }, [activate])
}

export default useEagerConnect
