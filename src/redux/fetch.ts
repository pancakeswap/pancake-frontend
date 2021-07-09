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
  updateZombiePriceBnb, updateBnbPriceUsd, updateDrFrankensteinZombieBalance, updateTomb,
} from './actions'
import { getAddress, getDrFrankensteinAddress } from '../utils/addressHelpers'
import tombs from './tombs'


// eslint-disable-next-line import/prefer-default-export
export const initialData = (account: string) => {
  store.dispatch(updateAccount(account))
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

  if (account) {
    zombie.methods.allowance(account, getDrFrankensteinAddress()).call()
      .then(res => {
        store.dispatch(updateZombieAllowance(res))
      })

    zombie.methods.balanceOf(account).call()
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
                      reserves: [reservesRes._reserve0, reservesRes._reserve1]
                    },
                  ))
                })
            })
        })
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