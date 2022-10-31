import { BigNumber as EthersBigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

import orderBy from "lodash/orderBy";

import { DeserializedPool, DeserializedPoolVault, VaultKey, DeserializedPoolLockedVault } from "../types";

import { getCakeVaultEarnings } from "./getCakeVaultEarnings";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: DeserializedPool<T>[]) {
  switch (sortOption) {
    case "apr":
      // Ternary is needed to prevent pools without APR (like MIX) getting top spot
      return orderBy(poolsToSort, (pool: DeserializedPool<T>) => (pool.apr ? pool.apr : 0), "desc");
    case "earned":
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool<T>) => {
          if (!pool.userData || !pool.earningTokenPrice) {
            return 0;
          }

          if (pool.vaultKey) {
            const { userData, pricePerFullShare } = pool as DeserializedPoolVault<T>;
            if (!userData || !userData.userShares) {
              return 0;
            }
            return getCakeVaultEarnings(
              account,
              userData.cakeAtLastUserAction,
              userData.userShares,
              pricePerFullShare,
              pool.earningTokenPrice,
              pool.vaultKey === VaultKey.CakeVault
                ? (pool as DeserializedPoolLockedVault<T>)?.userData?.currentPerformanceFee?.plus(
                    (pool as DeserializedPoolLockedVault<T>)?.userData?.currentOverdueFee || 0
                  )
                : undefined
            ).autoUsdToDisplay;
          }
          return pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber();
        },
        "desc"
      );
    case "totalStaked": {
      return orderBy(
        poolsToSort,
        (pool: DeserializedPool<T>) => {
          let totalStaked = Number.NaN;
          if (pool.vaultKey) {
            const vault = pool as DeserializedPoolVault<T>;
            if (pool.stakingTokenPrice && vault?.totalCakeInVault?.isFinite()) {
              totalStaked =
                +formatUnits(EthersBigNumber.from(vault.totalCakeInVault.toString()), pool?.stakingToken?.decimals) *
                pool.stakingTokenPrice;
            }
          } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
            totalStaked =
              +formatUnits(EthersBigNumber.from(pool.totalStaked.toString()), pool?.stakingToken?.decimals) *
              pool.stakingTokenPrice;
          }
          return Number.isFinite(totalStaked) ? totalStaked : 0;
        },
        "desc"
      );
    }
    case "latest":
      return orderBy(poolsToSort, (pool: DeserializedPool<T>) => Number(pool.sousId), "desc");
    default:
      return poolsToSort;
  }
}
