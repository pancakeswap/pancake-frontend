import { PoolUpdater, TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  return (
    <>
      <PoolUpdater />
      <TokenUpdater />
      <InfoNav />
      {children}
    </>
  )
}
