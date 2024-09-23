import { ChainId } from '@pancakeswap/chains'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { createSiweMessage, generateSiweNonce, parseSiweMessage } from 'viem/siwe'
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi'

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000

const siweAtom = atomWithStorage<
  | {
      message: string
      signature: string
      jwtToken: string
    }
  | undefined
>(
  'gamification-siwe-v2',
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

  const isSiweValid = useMemo(() => {
    if (siwe) {
      const parsed = parseSiweMessage(siwe.message)
      if (
        parsed.address === currentAddress &&
        parsed.domain === window.location.host &&
        parsed.uri === window.location.origin &&
        (parsed.expirationTime?.getTime() ?? 0) > Date.now()
      ) {
        return true
      }

      return false
    }

    return false
  }, [currentAddress, siwe])

  const signIn = useCallback(
    async ({ address, chainId = currentChainId }: { address: Address; chainId?: ChainId }) => {
      if (typeof window === 'undefined') {
        throw new Error('Unable to sign in outside of browser context')
      }
      if (!chainId) {
        throw new Error(`Invalid chain ${chainId}`)
      }
      if (isSiweValid && siwe) {
        return siwe
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

      const response = await fetch(`${GAMIFICATION_PUBLIC_API}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentAddress,
          signature,
          encodedMessage: encodeURIComponent(message),
        }),
      })

      const result = await response.json()

      const siweMessage = {
        message,
        signature,
        jwtToken: result.token,
      }
      setSiwe(siweMessage)
      return siweMessage
    },
    [currentAddress, isSiweValid, currentChainId, siwe, setSiwe, signMessageAsync],
  )

  const signOut = useCallback(() => setSiwe(RESET), [setSiwe])

  const fetchWithSiweAuth = useCallback<typeof fetch>(
    async (input: RequestInfo | URL, init: RequestInit | undefined) => {
      if (!currentAddress || !currentChainId) throw new Error('Invalid address or chain id')
      const { jwtToken } = await signIn({
        address: currentAddress,
        chainId: currentChainId,
      })

      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${jwtToken}`,
        },
      })
    },
    [signIn, currentChainId, currentAddress],
  )

  return {
    siwe,
    isSiweValid,
    signIn,
    signOut,
    fetchWithSiweAuth,
  }
}
