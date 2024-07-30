import { ChainId } from '@pancakeswap/chains'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'
import { useCallback } from 'react'
import { Address } from 'viem'
import { createSiweMessage, generateSiweNonce, parseSiweMessage } from 'viem/siwe'
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi'

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000

const siweAtom = atomWithStorage<
  | {
      message: string
      signature: string
    }
  | undefined
>(
  'gamification-siwe',
  undefined,
  createJSONStorage(() => localStorage),
)

export function useAutoSiwe() {
  const { signIn, signOut } = useSiwe()

  const trySignIn = useCallback(
    async ({ address: addr }: { address: Address }) => {
      try {
        await signIn({ address: addr })
      } catch (e) {
        console.error('Failed to sign in', e)
      }
    },
    [signIn],
  )

  useAccountEffect({
    onConnect({ address: addr }) {
      trySignIn({ address: addr })
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
    async ({ address, chainId = currentChainId }: { address: Address; chainId?: ChainId }) => {
      if (typeof window === 'undefined') {
        throw new Error('Unable to sign in outside of browser context')
      }
      if (!chainId) {
        throw new Error(`Invalid chain ${chainId}`)
      }
      if (siwe) {
        const parsed = parseSiweMessage(siwe.message)
        if (
          parsed.address === currentAddress &&
          parsed.domain === window.location.host &&
          parsed.uri === window.location.origin &&
          (parsed.expirationTime?.getTime() ?? 0) > Date.now()
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
        expirationTime: new Date(Date.now() + ONE_DAY_IN_MS),
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
    [currentAddress, currentChainId, siwe, setSiwe, signMessageAsync],
  )

  const signOut = useCallback(() => setSiwe(RESET), [setSiwe])

  const fetchWithSiweAuth = useCallback<typeof fetch>(
    async (input: RequestInfo | URL, init: RequestInit | undefined) => {
      if (!currentAddress || !currentChainId) throw new Error('Invalid address or chain id')
      const { message, signature } = await signIn({
        address: currentAddress,
        chainId: currentChainId,
      })
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          'X-G-Siwe-Message': encodeURIComponent(message),
          'X-G-Siwe-Signature': signature,
        },
      })
    },
    [signIn, currentChainId, currentAddress],
  )

  return {
    siwe,
    signIn,
    signOut,
    fetchWithSiweAuth,
  }
}
