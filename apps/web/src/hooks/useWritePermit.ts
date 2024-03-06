import { AllowanceTransfer, Permit, generatePermitTypedData, getPermit2Address } from '@pancakeswap/permit2-sdk'
import { Token } from '@pancakeswap/swap-sdk-core'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import { useCallback } from 'react'
import { Address, isHex } from 'viem'
import { useSignTypedData } from 'wagmi'
import useAccountActiveChain from './useAccountActiveChain'

export const useWritePermit = (token?: Token, spender?: Address, nonce?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { signTypedDataAsync } = useSignTypedData()

  return useCallback(async (): Promise<Permit2Signature> => {
    if (!chainId) throw new Error('PERMIT: missing chainId')
    if (!token) throw new Error('PERMIT: missing token')
    if (!spender) throw new Error('PERMIT: missing spender')
    if (!account) throw new Error('PERMIT: missing owner')
    if (nonce === undefined) throw new Error('PERMIT: missing nonce')

    const permit: Permit = generatePermitTypedData(token, nonce, spender)
    const {
      domain,
      types,
      values: message,
    } = AllowanceTransfer.getPermitData(permit, getPermit2Address(chainId), chainId)

    let signature = await signTypedDataAsync({
      account,
      domain,
      primaryType: 'PermitSingle',
      types,
      message,
    })

    // @hack: trust extension wallet doesn't prefix the signature with 0x
    signature = isHex(signature) ? signature : `0x${signature}`

    return {
      ...permit,
      signature,
    }
  }, [account, chainId, nonce, signTypedDataAsync, spender, token])
}
