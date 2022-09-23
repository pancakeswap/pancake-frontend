import { TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  return (
    <>
      <TokenUpdater />
      <InfoNav />
      {children}
    </>
  )
}
