import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import {
  getBep20Contract,
  getDrFrankensteinContract,
  getPancakePair,
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
  updateGravePoolInfo, updateGraveUserInfo,
} from './actions'
import { getAddress, getDrFrankensteinAddress } from '../utils/addressHelpers'
import tombs from './tombs'
import * as get from './get'
import graves from './graves'
import { BIG_ZERO } from '../utils/bigNumber'

// eslint-disable-next-line import/prefer-default-export
export const initialData = (accountAddress: string) => {
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

  zombiePriceBnb()

  tomb(tombs[0].pid)

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
                console.log(get.grave(pid))
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
            console.log(get.grave(pid))
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

const zombiePriceBnb = () => {
  getPancakePair(getAddress(tombs[0].lpAddresses)).methods.getReserves().call()
    .then(res => {
      store.dispatch(updateZombiePriceBnb(new BigNumber(res._reserve1).div(res._reserve0)))
    })
}

const bnbPriceUsd = () => {
  axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD')
    .then(res => {
      store.dispatch(updateBnbPriceUsd(res.data.price))
    })
}