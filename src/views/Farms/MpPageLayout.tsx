import { FC, useEffect } from 'react'
import { listenOnBnMessage, useInterceptLink, useInjectI18n } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'
import Farms from './Farms'

listenOnBnMessage()
const FarmsMpPageLayout: FC = ({ children }) => {
  useInterceptLink()
  const { injected } = useInjectI18n()
  const handleActive = useActiveHandle()

  useEffect(() => {
    const handleLoad = async () => {
      const account = await getAccount()
      if (account) {
        handleActive(false)
      }
    }
    handleLoad()
  }, [handleActive])

  return (
    <>
      <Navbar />
      {injected && <Farms>{children}</Farms>}
    </>
  )
}
export default FarmsMpPageLayout
