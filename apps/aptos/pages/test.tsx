import { useAccount, useConnect, useDisconnect } from '@pancakeswap/aptos'
import { Button } from '@pancakeswap/uikit'
import { Menu } from '../components/Menu'

function TestPage() {
  const { account } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <Menu>
      <div>{account?.address}</div>
      {connectors?.map((c) => (
        <div>
          {c.name}
          <Button onClick={() => connect({ connector: c })}>Connect</Button>
          <Button onClick={() => disconnect()}>disconnect</Button>
        </div>
      ))}
    </Menu>
  )
}

export default TestPage
