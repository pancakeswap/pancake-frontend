import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { MultiCall } from '@indexed-finance/multicall'
import Web3 from 'web3'
import { useEffect } from 'react'
import {
  getBep20Contract,
  getDrFrankensteinContract, getErc721Contract,
  getPancakePair, getSpawningPoolContract,
  getZombieContract,
} from '../utils/contractHelpers'

import store from './store'
import {
  updateZombieAllowance,
  updateAccount,
  updateZombieTotalSupply,
  updateZombieBalance,
  updateZombiePriceBnb,
  updateBnbPriceUsd,
  updateDrFrankensteinZombieBalance,
  updateTomb,
  updateGravePoolInfo, updateGraveUserInfo, updateNftTotalSupply, updateSpawningPoolInfo, updateSpawningPoolUserInfo,
} from './actions'
import { getAddress, getDrFrankensteinAddress, getSpawningPoolAddress, getZombieAddress } from '../utils/addressHelpers'
import tombs from './tombs'
import * as get from './get'
import spawningPoolAbi from '../config/abi/spawningPool.json'
import { BIG_ZERO } from '../utils/bigNumber'
import { account, spawningPools } from './get'

// eslint-disable-next-line import/prefer-default-export
export const initialData = (accountAddress: string, setZombiePrice?: any) => {
  store.dispatch(updateAccount(accountAddress))
  const zombie = getZombieContract()

  zombie.methods.totalSupply().call()
    .then(res => {
      store.dispatch(updateZombieTotalSupply(new BigNumber(res)))
    })

  zombie.methods.balanceOf(getDrFrankensteinAddress()).call()
    .then(res => {
      store.dispatch(updateDrFrankensteinZombieBalance(new BigNumber(res)))
    })

  bnbPriceUsd()

  zombiePriceBnb(setZombiePrice)

  tomb(tombs[0].pid)

  nfts()

  if (accountAddress) {
    zombie.methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
      .then(res => {
        store.dispatch(updateZombieAllowance(new BigNumber(res)))
      })

    zombie.methods.balanceOf(accountAddress).call()
      .then(res => {
        store.dispatch(updateZombieBalance(new BigNumber(res)))
      })
  }

  initialGraveData()
}

export const tomb = (pid: number) => {
  getDrFrankensteinContract().methods.poolInfo(pid).call()
    .then(poolInfoRes => {
      const lpTokenContract = getPancakePair(poolInfoRes.lpToken)
      lpTokenContract.methods.balanceOf(getDrFrankensteinAddress()).call()
        .then(balanceRes => {
          lpTokenContract.methods.totalSupply().call()
            .then(totalSupplyRes => {
              lpTokenContract.methods.getReserves().call()
                .then(reservesRes => {
                  store.dispatch(updateTomb(
                    pid,
                    {
                      allocPoint: poolInfoRes.allocPoint,
                      withdrawalCooldown: poolInfoRes.tokenWithdrawalDate,
                      totalStaked: balanceRes,
                      totalSupply: totalSupplyRes,
                      reserves: [reservesRes._reserve0, reservesRes._reserve1],
                    },
                  ))
                })
            })
        })
    })
}

export const grave = (pid: number, setUserInfoState?, setPoolInfoState?) => {
  getDrFrankensteinContract().methods.poolInfo(pid).call()
    .then(poolInfoRes => {
      if (pid !== 0) {
        const graveStakingTokenContract = getBep20Contract(get.graveByPid(pid).stakingToken)
        graveStakingTokenContract.methods.totalSupply().call()
          .then(stakingTokenSupplyRes => {
            if (poolInfoRes.allocPoint !== 0) {
              store.dispatch(updateGravePoolInfo(
                pid,
                {
                  allocPoint: poolInfoRes.allocPoint,
                  withdrawCooldown: poolInfoRes.minimumStakingTime,
                  nftRevivalTime: poolInfoRes.nftRevivalTime,
                  totalStakingTokenStaked: new BigNumber(stakingTokenSupplyRes),
                  lpToken: poolInfoRes.lpToken,
                  unlockFee: new BigNumber(poolInfoRes.unlockFee),
                  minimumStake: new BigNumber(poolInfoRes.minimumStake),
                }))
              if (setPoolInfoState) {
                setPoolInfoState(get.grave(pid))
              }
            }
          })
      } else {
        let traditionalGraveTotalStaked = BIG_ZERO
        get.graves().forEach(g => {
          const totalStaked = g.poolInfo.totalStakingTokenStaked
          if (!totalStaked.isNaN()) {
            traditionalGraveTotalStaked = traditionalGraveTotalStaked.plus(totalStaked)
          }
        })
        let totalStaked = get.drFrankensteinZombieBalance().minus(traditionalGraveTotalStaked)
        totalStaked = totalStaked.isZero() || totalStaked.isNegative() ? get.grave(pid).poolInfo.totalStakingTokenStaked : totalStaked
        if (poolInfoRes.allocPoint !== 0) {
          store.dispatch(updateGravePoolInfo(
            pid,
            {
              allocPoint: poolInfoRes.allocPoint,
              withdrawCooldown: poolInfoRes.tokenWithdrawalTime,
              nftRevivalTime: poolInfoRes.nftRevivalTime,
              totalStakingTokenStaked: totalStaked,
              lpToken: poolInfoRes.lpToken,
              unlockFee: new BigNumber(poolInfoRes.unlockFee),
              minimumStake: new BigNumber(poolInfoRes.minimumStake),
            }))
          if (setPoolInfoState) {
            setPoolInfoState(get.grave(pid))
          }
        }
      }
    })
  if (get.account()) {
    getDrFrankensteinContract().methods.userInfo(pid, get.account()).call()
      .then(userInfo => {
        getDrFrankensteinContract().methods.pendingZombie(pid, get.account()).call()
          .then(pendingZombieRes => {
            store.dispatch(updateGraveUserInfo(
              pid,
              {
                amount: new BigNumber(userInfo.amount),
                tokenWithdrawalDate: userInfo.tokenWithdrawalDate,
                nftRevivalDate: userInfo.nftRevivalDate,
                paidUnlockFee: userInfo.paidUnlockFee,
                rugDeposited: new BigNumber(userInfo.rugDeposited),
                pendingZombie: new BigNumber(pendingZombieRes),
              },
            ))
            if (setUserInfoState) {
              setUserInfoState(get.grave(pid))
            }
          })
      })
  }
}

export const initialGraveData = (setUserState?, setPoolState?) => {
  get.graves().forEach(g => {
    grave(g.pid, setUserState, setPoolState)
  })
}

export const spawningPool = (id: number, multi: any, zombie: any, setPoolData?: any, setUserData?: any) => {
  const address = getSpawningPoolAddress(id)
  let inputs = [
    { target: address, function: 'rewardPerBlock', args: [] },
    { target: address, function: 'unlockFeeInBnb', args: [] },
    { target: address, function: 'minimumStake', args: [] },
    { target: address, function: 'minimumStakingTime', args: [] },
    { target: address, function: 'nftRevivalTime', args: [] },
  ]
  multi.multiCall(spawningPoolAbi, inputs)
    .then(poolInfoRes => {
      const res = poolInfoRes[1]
      zombie.methods.balanceOf(getSpawningPoolAddress(id)).call()
        .then(balanceRes => {
          store.dispatch(updateSpawningPoolInfo(
            id,
            {
              rewardPerBlock: new BigNumber(res[0].toString()),
              unlockFee: new BigNumber(res[1].toString()),
              minimumStake: new BigNumber(res[2].toString()),
              totalZombieStaked: new BigNumber(balanceRes.toString()),
              withdrawCooldown: res[4],
              nftRevivalTime: res[5],
            },
          ))
          if (setPoolData) {
            setPoolData(get.spawningPool(id).poolInfo)
          }
        })
    })
    .catch((res) => {
      console.log('multicall failed')
    })
  if (account()) {
    inputs = [
      { target: address, function: 'userInfo', args: [account()] },
      { target: address, function: 'pendingReward', args: [account()] },
    ]

    multi.multiCall(spawningPoolAbi, inputs)
      .then(userInfoRes => {
        const res = userInfoRes[1]
        getZombieContract().methods.allowance(get.account(), address).call()
          .then(balanceRes => {
            store.dispatch(updateSpawningPoolUserInfo(
              id,
              {
                paidUnlockFee: res[0].paidUnlockFee,
                tokenWithdrawalDate: res[0].tokenWithdrawalDate.toNumber(),
                nftRevivalDate: res[0].nftRevivalDate.toNumber(),
                amount: new BigNumber(res[0].amount.toString()),
                pendingReward: new BigNumber(res[1].toString()),
                zombieAllowance: new BigNumber(balanceRes.toString()),
              },
            ))
            if (setUserData) {
              setUserData(get.spawningPool(id))
            }
          })
          .catch((err) => {
            console.log('allowance failed')
          })
      })
      .catch(() => {
        console.count('userinfo multicall failed')
      })
  }
}

export const initialSpawningPoolData = (multi: any, zombie: any, setPoolData?: any, setUserData?: any) => {
  get.spawningPools().forEach(sp => {
    spawningPool(sp.id, multi, zombie, setPoolData, setUserData)
  })
}

const zombiePriceBnb = (setZombiePrice?: any) => {
  getPancakePair(getAddress(tombs[0].lpAddresses)).methods.getReserves().call()
    .then(res => {
      const price = new BigNumber(res._reserve1).div(res._reserve0)
      store.dispatch(updateZombiePriceBnb(price))
      if (setZombiePrice) {
        setZombiePrice(price)
      }
    })
}

const bnbPriceUsd = () => {
  axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD')
    .then(res => {
      store.dispatch(updateBnbPriceUsd(res.data.price))
    })
}

const nfts = () => {
  get.nfts().forEach(nft => {
    getErc721Contract(nft.address).methods.totalSupply().call()
      .then(res => {
        store.dispatch(updateNftTotalSupply(nft.id, new BigNumber(res)))
      })
  })
}