import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { AllowanceTransfer, MaxAllowanceTransferAmount, PERMIT2_ADDRESS, PermitSingle } from '@pancakeswap/permit2-sdk'
import { useContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useSignTypedData } from 'wagmi'
import PERMIT2_ABI from '../config/abi/permit2.json'
import useAccountActiveChain from './useAccountActiveChain'
import { _TypedDataEncoder } from 'ethers/lib/utils'
import { publicClient } from 'utils/wagmi'
// import { domain } from '@snapshot-labs/snapshot.js/dist/sign'

const PERMIT_EXPIRATION = 2592000000 // 30 day
const PERMIT_SIG_EXPIRATION = 1800000 // 30 min

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000)
}
const DUMMY = '0x0000000000000000000000000000000000000000'
export function usePermitAllowance(token?: Token, owner?: string, spender?: string) {
  const contract = useContract(PERMIT2_ADDRESS, PERMIT2_ABI as any)

  // hardcoding for now will remove in next cpmmot
  const inputs = useMemo(() => [owner ?? DUMMY, token?.address ?? DUMMY, spender ?? DUMMY], [owner, spender, token?.address])

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the permitAllowance is synced upon submission and updated upon being synced.
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>()
  const result = useSingleCallResult({
    contract,
    functionName: 'allowance',
    args: inputs,
  }).result as any // as Awaited<ReturnType<Permit2['allowance']>> | undefined

  const rawAmount = result ? result[0]?.toString() : 0 // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount],
  )
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance])

  return useMemo(
    () => ({ permitAllowance: allowance, expiration: result ? result[1] : 0, nonce: result ? result[2] : 0 }),
    [allowance, result],
  )
}

interface Permit extends PermitSingle {
  sigDeadline: number
}

export interface PermitSignature extends Permit {
  signature: string
}

export function useUpdatePermitAllowance(
  token: Token | undefined,
  spender: string | undefined,
  nonce: number | undefined,
  onPermitSignature: (signature: PermitSignature) => void,
) {
  const { account, chainId } = useAccountActiveChain()
  const { signTypedDataAsync } = useSignTypedData()
  const { t } = useTranslation()
  return useCallback(async () => {
    try {
      if (!chainId) throw new Error('missing chainId')
      if (!token) throw new Error('missing token')
      if (!spender) throw new Error('missing spender')
      if (!account) throw new Error('missing spender')

      if (nonce === undefined) throw new Error('missing nonce')

      const permit: Permit = {
        details: {
          token: token.address,
          amount: MaxAllowanceTransferAmount.toString(),
          expiration: toDeadline(PERMIT_EXPIRATION).toString(),
          nonce: nonce.toString(),
        },
        spender,
        sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION).toString(),
      }

      const { domain, types, values } = AllowanceTransfer.getPermitData(permit, PERMIT2_ADDRESS, chainId)
  
      const signature = await signTypedDataAsync({
        account,
        domain,
        primaryType: 'PermitSingle',
        types,
        message: values
      })
    
      onPermitSignature?.({ ...permit, signature })
      return
    } catch (error: unknown) {
      if (isUserRejected(error)) {
        throw new TransactionRejectedError(t('Transaction rejected'))
      } else {
        // otherwise, the error was unexpected and we need to convey that
        throw new Error(`Swap failed: ${transactionErrorToUserReadableMessage(error, t)}`)
      }
    }
  }, [chainId, nonce, account, onPermitSignature, spender, token, signTypedDataAsync, t])
}
