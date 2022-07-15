import { FC, useEffect } from 'react'
import { listenOnBnMessage, useInterceptLink, useInjectI18n } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'

listenOnBnMessage()
const PoolsMpPageLayout: FC = ({ children }) => {
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
      {injected && children}
    </>
  )
}
export default PoolsMpPageLayout
