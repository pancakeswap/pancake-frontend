import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { useERC20, useTokenContract } from 'hooks/useContract'

function useTokenAllowanceFromAkka(tokenAdress?: string, owner?: string, spender?: string): BigNumber | undefined {
  const contract = useTokenContract(tokenAdress)
  const [allowance, setAllowance] = useState<BigNumber>(undefined)

  useEffect(() => {
    if (owner && tokenAdress && spender) {
      contract.allowance(owner, spender).then((data) => {
        setAllowance(data)
      })
    }
  }, [owner, tokenAdress, spender])

  return useMemo(() => (tokenAdress && allowance ? allowance : undefined), [tokenAdress, allowance])
}

export default useTokenAllowanceFromAkka
