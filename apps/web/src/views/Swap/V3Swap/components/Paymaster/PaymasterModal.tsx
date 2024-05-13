import { useMemo } from 'react'
import { usePaymaster } from './hooks/usePaymaster'

function PaymasterModal() {
  const { getPaymasterTokenlist } = usePaymaster()
  const tokenList = useMemo(() => {
    // TODO: have to get user's balances of the tokens as well. have to reference current tokenList implementation
    return getPaymasterTokenlist()
  }, [getPaymasterTokenlist])

  return (
    <>
      <h1>Paymaster Modal</h1>
    </>
  )
}

export default PaymasterModal
