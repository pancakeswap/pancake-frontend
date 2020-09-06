import { useCallback, useContext } from 'react'
import { Context } from '../contexts/Modals'

const useModal = (modal: React.ReactNode, key?: string) => {
  const { onDismiss, onPresent } = useContext(Context)

  const handlePresent = useCallback(() => {
    onPresent(modal, key)
  }, [key, modal, onPresent])

  return [handlePresent, onDismiss]
}

export default useModal
