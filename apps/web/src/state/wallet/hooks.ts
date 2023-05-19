import { Currency, CurrencyAmount, Native, Token } from '@pancakeswap/sdk'
import { multicallABI } from 'config/abi/Multicall'
import { useAllTokens } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import orderBy from 'lodash/orderBy'
import { useMemo } from 'react'
import { isAddress } from 'utils'
import { getMulticallAddress } from 'utils/addressHelpers'
import { Address } from 'viem'
import { erc20ABI, useAccount } from 'wagmi'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'

/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export function useNativeBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Native> | undefined
} {
  const native = useNativeCurrency()

  const addresses: Address[] = useMemo(
    () =>
      uncheckedAddresses ? orderBy(uncheckedAddresses.map(isAddress).filter((a): a is Address => a !== false)) : [],
    [uncheckedAddresses],
  )

  const results = useSingleContractMultipleData({
    contract: {
      abi: multicallABI,
      address: getMulticallAddress(native.chainId),
    },
    functionName: 'getEthBalance',
    args: useMemo(() => addresses.map((address) => [address] as const), [addresses]),
  })

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Native> }>((memo, address, i) => {
        const value = results?.[i]?.result
        if (typeof value !== 'undefined') memo[address] = CurrencyAmount.fromRawAmount(native, BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results, native],
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens],
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData({
    abi: erc20ABI,
    addresses: validatedTokenAddresses,
    functionName: 'balanceOf',
    args: useMemo(() => [address as Address] as const, [address]),
    options: {
      enabled: Boolean(address && validatedTokenAddresses.length > 0),
    },
  })

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result
              const amount = typeof value !== 'undefined' ? BigInt(value.toString()) : undefined
              if (typeof amount !== 'undefined') {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances],
    ),
    anyLoading,
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token]),
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...currencies],
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsNative: boolean = useMemo(
    () => currencies?.some((currency) => currency?.isNative) ?? false,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...currencies],
  )
  const uncheckedAddresses = useMemo(() => (containsNative ? [account] : []), [containsNative, account])
  const nativeBalance = useNativeBalances(uncheckedAddresses)

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency?.isToken) return tokenBalances[currency.address]
        if (currency?.isNative) return nativeBalance[account]
        return undefined
      }) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, ...currencies, nativeBalance, tokenBalances],
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency]),
  )[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  const { address: account } = useAccount()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}
