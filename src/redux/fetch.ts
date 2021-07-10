import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import {
  getBep20Contract,
  getDrFrankensteinContract,
  getLpContract,
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
import { account, graveByPid } from './get'
import graves from './graves'


// eslint-disable-next-line import/prefer-default-export
export const initialData = (accountAddress: string) => {
  store.dispatch(updateAccount(accountAddress))
  const zombie = getZombieContract()

  zombie.methods.totalSupply().call()
    .then(res => {
      store.dispatch(updateZombieTotalSupply(res))
    })

  zombie.methods.balanceOf(getDrFrankensteinAddress()).call()
    .then(res => {
      store.dispatch(updateDrFrankensteinZombieBalance(res))
    })

  bnbPriceUsd()

  zombiePriceBnb()

  tomb(tombs[0].pid)

  if (accountAddress) {
    zombie.methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
      .then(res => {
        store.dispatch(updateZombieAllowance(res))
      })

    zombie.methods.balanceOf(accountAddress).call()
      .then(res => {
        store.dispatch(updateZombieBalance(res))
      })
  }
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

export const grave = (pid: number) => {
  getDrFrankensteinContract().methods.poolInfo(pid).call()
    .then(poolInfoRes => {
      const graveStakingTokenContract = getBep20Contract((graveByPid(pid).stakingToken.address))
      graveStakingTokenContract.methods.totalSupply().call()
        .then(stakingTokenSupplyRes => {
          store.dispatch(updateGravePoolInfo(
            pid,
            {
              allocPoint: poolInfoRes.allocPoint,
              tokenWithdrawalCooldown: poolInfoRes.tokenWithdrawalTime,
              nftRevivalTime: poolInfoRes.nftRevivalTime,
              totalStakingTokenStaked: stakingTokenSupplyRes,
            },
          ))
          if (account()) {
            getDrFrankensteinContract().methods.userInfo(account())
              .then(userInfo => {
                store.dispatch(updateGraveUserInfo(
                  pid,
                  {
                    amount: userInfo.amount,
                    tokenWithdrawal: userInfo.tokenWithdrawalDate,
                    nftRevivalTime: userInfo.nftRevivalDate,
                  },
                ))
              })
          }
        })
    })
}

export const initialGraveData = () => {
  graves.forEach(g => {
    grave(g.pid)
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