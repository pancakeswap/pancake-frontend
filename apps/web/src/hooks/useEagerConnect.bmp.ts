/* eslint-disable no-console */
import { useCallback } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

const useActive = () => {
  const { connectAsync } = useConnect()
  return useCallback(
    () =>
      connectAsync({ connector: injected() }).catch((error) => {
        console.log('🚀 ~ file: useEagerConnect.ts ~ line 183 ~ activate ~ error', error)
        // captureException(error)
      }),
    [connectAsync],
  )
}
export const useEagerConnect = () => {
  // noop
}

export const useActiveHandle = () => {
  const { address } = useAccount()
  const handleActive = useActive()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const main = async () => {
    /**
     *  backward
     */
    console.log('~ before getAccount')
    console.log('~ after getAccount', address)
    return new Promise((resolve) => {
      handleActive().then(resolve)
    })
  }
  return async (showToast = true) => {
    await main()
    if (address && showToast) {
      toastSuccess(t('Success'), 'Wallet connected')
    }
  }
}
export default useEagerConnect
