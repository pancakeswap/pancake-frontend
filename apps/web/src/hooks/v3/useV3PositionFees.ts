import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/v3-sdk'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { useSingleCallResult } from 'state/multicall/hooks'
import { unwrappedToken } from 'utils/wrappedCurrency'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(
  pool?: Pool,
  tokenId?: BigNumber,
  asWETH = false,
): [CurrencyAmount<Currency>, CurrencyAmount<Currency>] | [undefined, undefined] {
  const positionManager = useV3NFTPositionManagerContract(false)
  const owner: string | undefined = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [
    tokenId?.toString(),
  ]).result?.[0]

  const tokenIdHexString = tokenId?.toHexString()
  const latestBlockNumber = useCurrentBlock()

  // we can't use multicall for this because we need to simulate the call from a specific address
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState<[BigNumber, BigNumber] | undefined>()
  useEffect(() => {
    if (positionManager && tokenIdHexString && owner) {
      positionManager.callStatic
        .collect(
          {
            tokenId: tokenIdHexString,
            recipient: owner, // some tokens might fail if transferred to address(0)
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
          { from: owner }, // need to simulate the call as the owner
        )
        .then((results) => {
          setAmounts([results.amount0, results.amount1])
        })
    }
  }, [positionManager, tokenIdHexString, owner, latestBlockNumber])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(asWETH ? pool.token0 : unwrappedToken(pool.token0), amounts[0].toString()),
      CurrencyAmount.fromRawAmount(asWETH ? pool.token1 : unwrappedToken(pool.token1), amounts[1].toString()),
    ]
  }
  return [undefined, undefined]
}
