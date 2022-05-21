import { useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BLOCKED_ADDRESSES } from './config/constants'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'

export function Updaters() {
  const router = useRouter()
  const includeListUpdater = ['/swap', '/limit-orders', '/add', '/find', '/remove'].some((item) => {
    return router.pathname.startsWith(item)
  })
  return (
    <>
      {includeListUpdater && <ListsUpdater />}
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

export function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked address</div>
  }
  return <>{children}</>
}
