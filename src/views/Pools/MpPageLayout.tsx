import { FC, useEffect } from 'react'
import { listenOnBnMessage, useInterceptLink } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'

listenOnBnMessage()
const PoolsMpPageLayout: FC = ({ children }) => {
  useInterceptLink()
  const handleActive = useActiveHandle()

  useEffect(() => {
    const handleLoad = async () => {
      const account = await getAccount()
      if (account) {
        handleActive(false)
      }
    }
    handleLoad()
  }, [])

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
export default PoolsMpPageLayout
