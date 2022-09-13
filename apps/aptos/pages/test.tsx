import { useAccount, useConnect, useDisconnect, useSendTransaction } from '@pancakeswap/awgmi'
import { Button } from '@pancakeswap/uikit'
import { Menu } from '../components/Menu'

function TestPage() {
  const { account, connector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { sendTransactionAsync } = useSendTransaction({
    payload: {
      type_arguments: [],
      arguments: ['Hello JoJo2'],
      function: `0x1475ddbffb8e29a32223e1e25b8459d03a5ddd94e1cb7a50bb7051e11ba0cb2f::message::set_message`,
    },
  })

  const seeeend = () => {
    sendTransactionAsync?.().then((v) => {
      console.log(v)
    })
  }
  return (
    <>
      <Button onClick={() => seeeend()}>send</Button>
    </>
  )
}

export default TestPage
