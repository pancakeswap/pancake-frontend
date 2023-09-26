import { useTranslation } from '@pancakeswap/localization'
import {
  AllowanceTransfer,
  MaxAllowanceTransferAmount,
  PERMIT2_ADDRESS,
  PermitSingle
} from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { FAST_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { publicClient } from 'utils/wagmi'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useQuery, useSignTypedData } from 'wagmi'
import PERMIT2_ABI from '../config/abi/permit2.json'
import useAccountActiveChain from './useAccountActiveChain'
import { useActiveChainId } from './useActiveChainId'
const PERMIT_EXPIRATION = 2592000000 // 30 day
const PERMIT_SIG_EXPIRATION = 1800000 // 30 min

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000)
}
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function usePermitAllowance(token?: Token, owner?: string, spender?: string) {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(
    () => [owner ?? ZERO_ADDRESS, token?.address ?? ZERO_ADDRESS, spender ?? ZERO_ADDRESS],
    [owner, spender, token?.address],
  )

  const { data: allowance, refetch } = useQuery(
    [chainId, token?.address, owner, spender],
    () =>
      publicClient({ chainId }).readContract({
        abi: PERMIT2_ABI,
        address: PERMIT2_ADDRESS,
        functionName: 'allowance',
        args: inputs,
      }),
    {
      refetchInterval: FAST_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(spender && owner),
    },
  )
  return useMemo(
    () => ({
      permitAllowance:
        token && typeof allowance !== 'undefined' ? CurrencyAmount.fromRawAmount(token, allowance[0].toString()) : 0,
      expiration: token && typeof allowance !== 'undefined' ? allowance[1] : 0,
      nonce: token && typeof allowance !== 'undefined' ? allowance[2] : 0,
    }),
    [token, refetch, allowance],
  )
}

interface Permit extends PermitSingle {
  sigDeadline: string
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
        message: values,
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
