import { ChainId } from '@pancakeswap/chains'
import { GAMIFICATION_PUBLIC_DASHBOARD_API } from 'config/constants/endpoints'
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'
import { useCallback } from 'react'
import { Address } from 'viem'
import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
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
  'gamification-dashboard-siwe',
  undefined,
  createJSONStorage(() => localStorage),
)

export function useAutoSiwe() {
  const { signIn, signOut } = useDashboardSiwe()

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

export function useDashboardSiwe() {
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
      return {
        message:
          'localhost:3005 wants you to sign in with your Ethereum account:\n0x7544503807b4DF4fc3Db6AcF4f32Ce5E7eE8FdFb\n\n\nURI: http://localhost:3005\nVersion: 1\nChain ID: 56\nNonce: 6674c8c3d411f0d4093723ff85a68c6675adf74445cf94502d61e3a65d7a38f4e3be4b2d95ec5df29a9d16a081e2c11b\nIssued At: 2024-09-04T08:18:19.709Z\nExpiration Time: 2024-09-05T08:18:19.709Z',
        signature:
          '0x172c8ce4190962c1f7fdfe9ab395780a748a39fdb2c33d284e086af2187827cb604003399b28eac0d43a657b86ad0fcff3b4c43900719355cc8610e8630bd3411b',
        jwtToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIweDc1NDQ1MDM4MDdiNERGNGZjM0RiNkFjRjRmMzJDZTVFN2VFOEZkRmIiLCJpYXQiOjE3MjU0Mzc5MDYsImV4cCI6MTcyNTUyNDMwNn0.IANrFnxK1d2DVof3zQtZNdcuyA8f_lzad2uIBe8mdBI',
      }
      // if (siwe) {
      //   const parsed = parseSiweMessage(siwe.message)
      //   if (
      //     parsed.address === currentAddress &&
      //     parsed.domain === window.location.host &&
      //     parsed.uri === window.location.origin &&
      //     (parsed.expirationTime?.getTime() ?? 0) > Date.now()
      //   ) {
      //     return siwe
      //   }
      // }

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

      const response = await fetch(`${GAMIFICATION_PUBLIC_DASHBOARD_API}/users/authenticate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
    [currentAddress, currentChainId, siwe, setSiwe, signMessageAsync],
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
    signIn,
    signOut,
    fetchWithSiweAuth,
  }
}
