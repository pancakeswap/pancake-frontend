import { useSendTransaction } from '@pancakeswap/awgmi'
import { Button } from '@pancakeswap/uikit'

function TestPage() {
  const { sendTransactionAsync } = useSendTransaction({
    payload: {
      type_arguments: [],
      arguments: ['Hello JoJo2'],
      function: `0x1475ddbffb8e29a32223e1e25b8459d03a5ddd94e1cb7a50bb7051e11ba0cb2f::message::set_message`,
    },
  })

  const seeeend = () => {
    sendTransactionAsync?.().then((v) => {
      v.wait()
    })
  }
  return (
    <>
      <Button onClick={() => seeeend()}>send</Button>
    </>
  )
}

export default TestPage
