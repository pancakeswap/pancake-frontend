import { ChainId } from '@pancakeswap/sdk'

import { StableSwapPair } from './types'

export async function getStableSwapPairs(chainId: ChainId): Promise<StableSwapPair[]> {
  // Stable swap is only supported on BSC chain
  if (chainId !== ChainId.BSC) {
    return []
  }

  // TODO change to get stable swap pairs from config
  // let pairs: Pair[] = [];
  // let pairsPage = await getPairsFirstPage();
  // pairs = pairs.concat(pairsPage);

  // while (pairsPage.length === 1000) {
  //   pairsPage = await getPairsNextPages(
  //     pairs[pairs.length - 1].trackedReserveBNB
  //   );
  //   pairs = pairs.concat(pairsPage);
  // }

  // return pairs.map(p => {
  //   const pair = new SdkPair(
  //     CurrencyAmount.fromRawAmount(
  //       new Token(
  //         chainId,
  //         getAddress(p.token0.id),
  //         Number(p.token0.decimals),
  //         p.token0.symbol,
  //         p.token0.name,
  //       ),
  //       '0',
  //     ),
  //     CurrencyAmount.fromRawAmount(
  //       new Token(
  //         chainId,
  //         getAddress(p.token1.id),
  //         Number(p.token1.decimals),
  //         p.token1.symbol,
  //         p.token1.name,
  //       ),
  //       '0',
  //     ),
  //   );
  //   (pair as StableSwapPair).stableSwapAddress = p.id;
  //   return pair as StableSwapPair;
  // });
  return []
}
