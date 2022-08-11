import { useContext } from 'react'
import { CanRegisterTokenContext } from '../contexts/CanRegisterToken/Provider'

const useCanRegisterToken = () => {
  const canRegisterTokenContext = useContext(CanRegisterTokenContext)

  if (canRegisterTokenContext === undefined) {
    throw new Error('Add Token Wallet Context context undefined')
  }

  return canRegisterTokenContext
}

export default useCanRegisterToken
