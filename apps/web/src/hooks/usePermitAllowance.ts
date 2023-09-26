import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import {
  AllowanceTransfer,
  MaxAllowanceTransferAmount,
  PERMIT2_ADDRESS,
  PermitSingle,
  AllowanceProvider,
  Permit2Abi,
} from '@pancakeswap/permit2-sdk'
import { useContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useQuery, useSignTypedData } from 'wagmi'
import PERMIT2_ABI from '../config/abi/permit2.json'
import useAccountActiveChain from './useAccountActiveChain'
import { _TypedDataEncoder } from 'ethers/lib/utils'
import { publicClient } from 'utils/wagmi'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from './useActiveChainId'
// import { domain } from '@snapshot-labs/snapshot.js/dist/sign'

const PERMIT_EXPIRATION = 2592000000 // 30 day
const PERMIT_SIG_EXPIRATION = 1800000 // 30 min

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000)
}
const DUMMY = '0x0000000000000000000000000000000000000000'

export function usePermitAllowance(token?: Token, owner?: string, spender?: string) {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(
    () => [owner ?? DUMMY, token?.address ?? DUMMY, spender ?? DUMMY],
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
  console.log(allowance)
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
