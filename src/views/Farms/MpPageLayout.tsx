import { FC, useEffect } from 'react'
import { listenOnBnMessage, useInterceptLink } from 'utils/mpBridge'
import { useActiveHandle, getAccount } from 'hooks/useEagerConnect.bmp'
import Navbar from 'components/Navbar.bmp'
import Farms from './Farms'

listenOnBnMessage()
const FarmsMpPageLayout: FC = ({ children }) => {
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
      <Farms>{children}</Farms>
    </>
  )
}
export default FarmsMpPageLayout
