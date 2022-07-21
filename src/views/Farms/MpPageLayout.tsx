import { FC, useEffect } from 'react'
import { listenOnBnMessage, useInterceptLink, useInjectI18n, useSystemInfo } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'
import { useTheme } from 'next-themes'
import Farms from './Farms'

listenOnBnMessage()
const FarmsMpPageLayout: FC = ({ children }) => {
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
