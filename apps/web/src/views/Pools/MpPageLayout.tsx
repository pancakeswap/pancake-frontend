import { FC, useEffect } from 'react'
import { useSystemInfo, listenOnBnMessage, useInterceptLink, useInjectI18n } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'
import { useTheme } from 'next-themes'

listenOnBnMessage()
const PoolsMpPageLayout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  useInterceptLink()
  const systemInfo = useSystemInfo()
  const { setTheme } = useTheme()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (systemInfo) {
      setTheme(systemInfo.theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemInfo])

  return (
    <>
      <Navbar />
      {injected && children}
    </>
  )
}
export default PoolsMpPageLayout
