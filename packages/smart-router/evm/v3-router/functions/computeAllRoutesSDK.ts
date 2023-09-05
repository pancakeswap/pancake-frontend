import { Currency, Token } from '@pancakeswap/swap-sdk-core';
import { Pair, Route as V2RouteRaw } from '@pancakeswap/sdk';
import { Pool, Route as V3RouteRaw } from '@pancakeswap/v3-sdk';
import { RouteType } from '../types';
import { involvesCurrency } from '../utils';

export class V3Route extends V3RouteRaw<Token, Token> {
      protocol: RouteType.V3 = RouteType.V3;
    }
    export class V2Route extends V2RouteRaw<Token, Token> {
      protocol: RouteType.V2 = RouteType.V2;
    }


export function computeAllV3Routes(
  tokenIn: Token,
  tokenOut: Token,
  pools: Pool[],
  maxHops: number
): V3Route[] {
  return computeAllRoutes<Pool, V3Route>(
    tokenIn,
    tokenOut,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (route: Pool[], tokenIn: Token, tokenOut: Token) => {
      return new V3Route(route, tokenIn, tokenOut);
    },
    pools,
    maxHops
  );
}

export function computeAllV2Routes(
  tokenIn: Token,
  tokenOut: Token,
  pools: Pair[],
  maxHops: number
): V2Route[] {
  return computeAllRoutes<Pair, V2Route>(
    tokenIn,
    tokenOut,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (route: Pair[], tokenIn: Token, tokenOut: Token) => {
      return new V2Route(route, tokenIn, tokenOut);
    },
    pools,
    maxHops
  );
}

export function computeAllMixedRoutes(
  tokenIn: Token,
  tokenOut: Token,
  parts: (Pool | Pair)[],
  maxHops: number
): (V2Route | V3Route)[] {
   const routesRawV2 = computeAllRoutes<Pair, V2Route>(
    tokenIn,
    tokenOut,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (route: (Pair)[], tokenIn: Token, tokenOut: Token) => {
      return new V2Route(route, tokenIn, tokenOut);
    },
    parts[0],
    maxHops
  );

  const routesRawV3 = computeAllRoutes<Pool, V3Route>(
      tokenIn,
      tokenOut,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      (route: Pool[], tokenIn: Token, tokenOut: Token) => {
        return new V3Route(route, tokenIn, tokenOut);
      },
      parts[1],
      maxHops
    );
 const routesRaw = [...routesRawV2, ...routesRawV3]
  /// filter out pure v3 and v2 routes
  return routesRaw
}

function involvesCurrency<
TPool extends Pair | Pool
>(pool: TPool, currency: Currency) {
      const token = currency.wrapped
      if (pool instanceof Pair) {
        const { reserve0, reserve1 } = pool
        return reserve0.currency.equals(token) || reserve1.currency.equals(token)
      }
      if (pool instanceof Pool) {
        const { token0, token1 } = pool
        return token0.equals(token) || token1.equals(token)
      }
      // if (isStablePool(pool)) {
      //   const { balances } = pool
      //   return balances.some((b) => b.currency.equals(token))
      // }
      return false
    }

export function computeAllRoutes<
  TPool extends Pair | Pool,
  TRoute extends V3Route | V2Route
>(
  tokenIn: Token,
  tokenOut: Token,
  buildRoute: (route: TPool[], tokenIn: Token, tokenOut: Token) => TRoute,
  pools: TPool[],
  maxHops: number
): TRoute[] {
  const poolsUsed = Array<boolean>(pools.length).fill(false);
  const routes: TRoute[] = [];

  const computeRoutes = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    tokenIn: Token,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    tokenOut: Token,
    currentRoute: TPool[],
    // eslint-disable-next-line @typescript-eslint/no-shadow
    poolsUsed: boolean[],
    tokensVisited: Set<string>,
    _previousTokenOut?: Token
  ) => {
    if (currentRoute.length > maxHops) {
      return;
    }
//     token.equals(this.token0) || token.equals(this.token1)
//    if(currentRoute.length >) console.log(currentRoute[currentRoute.length - 1].token0.address, currentRoute[currentRoute.length - 1].token1.address, tokenOut.address)
    if (
      currentRoute.length > 0 &&
      involvesCurrency(currentRoute[currentRoute.length - 1], tokenOut)
    ) {
      routes.push(buildRoute([...currentRoute], tokenIn, tokenOut));
      return;
    }

    for (let i = 0; i < pools.length; i++) {
      if (poolsUsed[i]) {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const curPool = pools[i]!;
      const previousTokenOut = _previousTokenOut || tokenIn;

      if (!involvesCurrency(curPool, previousTokenOut)) {
        continue;
      }

      const currentTokenOut = curPool.token0.equals(previousTokenOut)
        ? curPool.token1
        : curPool.token0;

      if (tokensVisited.has(currentTokenOut.address.toLowerCase())) {
        continue;
      }

      tokensVisited.add(currentTokenOut.address.toLowerCase());
      currentRoute.push(curPool);
      poolsUsed[i] = true;
      computeRoutes(
        tokenIn,
        tokenOut,
        currentRoute,
        poolsUsed,
        tokensVisited,
        currentTokenOut
      );
      poolsUsed[i] = false;
      currentRoute.pop();
      tokensVisited.delete(currentTokenOut.address.toLowerCase());
    }
  };

  computeRoutes(tokenIn, tokenOut, [], poolsUsed, new Set([tokenIn.address.toLowerCase()]));

  return routes;
}
