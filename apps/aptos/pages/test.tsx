import { useAccount, useClient, useConnect, useDisconnect } from '@pancakeswap/aptos'
import { Button } from '@pancakeswap/uikit'
import { Menu } from '../components/Menu'

function TestPage() {
  const client = useClient()
  const { account } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <Menu>
      <div>{account?.address}</div>
      <Button onClick={() => connect({ connector: connectors[0] })}>Connect</Button>
      <Button onClick={() => disconnect()}>disconnect</Button>
    </Menu>
  )
}

export default TestPage
