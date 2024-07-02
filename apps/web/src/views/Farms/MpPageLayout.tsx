import Navbar from 'components/Navbar.bmp'
import { getAccount, useActiveHandle } from 'hooks/useEagerConnect.bmp'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { listenOnBnMessage, useInjectI18n, useInterceptLink, useSystemInfo } from 'utils/mpBridge'
import Farms from './Farms'

listenOnBnMessage()
const FarmsMpPageLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
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
      {injected && <Farms>{children}</Farms>}
    </>
  )
}
export default FarmsMpPageLayout
