import { useAccount, useAccountEffect, useSignMessage } from 'wagmi'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { createSiweMessage, generateSiweNonce, parseSiweMessage } from 'viem/siwe'
import { useCallback } from 'react'
import { Address } from 'viem'
import { ChainId } from '@pancakeswap/chains'

const siweAtom = atomWithStorage<
  | {
      message: string
      signature: string
    }
  | undefined
>(
  'gamification-siwe',
  undefined,
  createJSONStorage(() => sessionStorage),
)

export function useAutoSiwe() {
  const { signIn, signOut } = useSiwe()

  useAccountEffect({
    onConnect({ address, chainId }) {
      signIn({ address, chainId })
    },
    onDisconnect() {
      signOut()
    },
  })
}

export function useSiwe() {
  const { chainId: currentChainId, address: currentAddress } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [siwe, setSiwe] = useAtom(siweAtom)

  const signIn = useCallback(
    async ({ address, chainId }: { address: Address; chainId: ChainId }) => {
      if (typeof window === 'undefined') {
        throw new Error('Unable to sign in outside of browser context')
      }
      if (siwe) {
        const parsed = parseSiweMessage(siwe.message)
        if (
          parsed.address === currentAddress &&
          parsed.chainId === currentChainId &&
          parsed.domain === window.location.host &&
          parsed.uri === window.location.origin
        ) {
          return siwe
        }
      }

      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        uri: window.location.origin,
        nonce: generateSiweNonce(),
        version: '1',
      })
      const signature = await signMessageAsync({
        account: address,
        message,
      })
      const siweMessage = {
        message,
        signature,
      }
      setSiwe(siweMessage)
      return siweMessage
    },
    [currentChainId, currentAddress, siwe],
  )

  const signOut = useCallback(() => setSiwe(undefined), [])

  return {
    siwe,
    signIn,
    signOut,
  }
}
