import { useTranslation } from '@pancakeswap/localization'
import {
  AllowanceTransfer,
  Permit2ABI,
  PermitSingle,
  generatePermitTypedData,
  getPermit2Address,
} from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { isUserRejected } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { publicClient } from 'utils/wagmi'
import { Address, zeroAddress } from 'viem'
import { TransactionRejectedError } from 'views/Swap/V3Swap/hooks/useSendSwapTransaction'
import { useQuery, useSignTypedData } from 'wagmi'
import useAccountActiveChain from './useAccountActiveChain'
import { useActiveChainId } from './useActiveChainId'

export function usePermitAllowance(token?: Token, owner?: Address, spender?: Address) {
  const { chainId } = useActiveChainId()

  const inputs = useMemo<[Address, Address, Address]>(
    () => [owner ?? zeroAddress, token?.address ?? zeroAddress, spender ?? zeroAddress],
    [owner, spender, token?.address],
  )

  const { data: allowance } = useQuery(
    [chainId, token?.address, owner, spender],
    () =>
      chainId
        ? publicClient({ chainId }).readContract({
            abi: Permit2ABI,
            address: getPermit2Address(chainId),
            functionName: 'allowance',
            args: inputs,
          })
        : undefined,
    {
      refetchInterval: SLOW_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(spender && owner),
    },
  )
  return useMemo(
    () => ({
      permitAllowance:
        token && typeof allowance !== 'undefined'
          ? CurrencyAmount.fromRawAmount(token, allowance[0].toString())
          : undefined,
      expiration: token && typeof allowance !== 'undefined' ? allowance[1] : undefined,
      nonce: token && typeof allowance !== 'undefined' ? allowance[2] : undefined,
    }),
    [token, allowance],
  )
}

interface Permit extends PermitSingle {
  sigDeadline: string
}

export function useUpdatePermitAllowance(
  token: Token | undefined,
  spender: string | undefined,
  nonce: number | undefined,
  onPermitSignature: (signature: Permit2Signature) => void,
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

      const permit: Permit = generatePermitTypedData(token, nonce, spender)
      const { domain, types, values } = AllowanceTransfer.getPermitData(permit, getPermit2Address(chainId), chainId)

      const signature = await signTypedDataAsync({
        account,
        domain,
        primaryType: 'PermitSingle',
        types,
        message: values,
      })
      onPermitSignature?.({ ...permit, signature })
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
