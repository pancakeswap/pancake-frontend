import axios from 'axios'
import { BigNumber } from 'bignumber.js'
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
  updateGravePoolInfo,
  updateGraveUserInfo,
  updateNftTotalSupply,
  updateSpawningPoolInfo,
  updateSpawningPoolUserInfo,
  updateTombPoolInfo, updateTombUserInfo, updateAuctionInfo, updateAuctionUserInfo,
} from './actions'
import {
  getAddress,
  getDrFrankensteinAddress,
  getMausoleumAddress,
  getSpawningPoolAddress,
  getZombieAddress,
} from '../utils/addressHelpers'
import tombs from './tombs'
import * as get from './get'
import spawningPoolAbi from '../config/abi/spawningPool.json'
import drFrankensteinAbi from '../config/abi/drFrankenstein.json'
import pancakePairAbi from '../config/abi/pancakePairAbi.json'
import { BIG_ZERO } from '../utils/bigNumber'
import { account, auctionById, spawningPools, zmbeBnbTomb } from './get'
import mausoleumAbi from '../config/abi/mausoleum.json'

// eslint-disable-next-line import/prefer-default-export
export const initialData = (accountAddress: string, multi: any, setZombiePrice?: any) => {
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

  tomb(tombs[0].pid, multi)

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

export const tomb = (pid: number, multi: any, updatePoolObj?: { update: boolean, setUpdate: any }, updateUserObj?: { update: boolean, setUpdate: any }, everyUpdateObj?: { update: boolean, setUpdate: any }) => {
  const contractAddress = getDrFrankensteinAddress()
  if (account()) {
    let inputs = [
      { target: contractAddress, function: 'poolInfo', args: [pid] },
      { target: contractAddress, function: 'userInfo', args: [pid, get.account()] },
      { target: contractAddress, function: 'pendingZombie', args: [pid, get.account()] },
    ]
    multi.multiCall(drFrankensteinAbi, inputs)
      .then(frankRes => {
        const drFrankensteinRes = frankRes[1]
        inputs = [
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'balanceOf', args: [contractAddress] },
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'getReserves', args: [] },
          {
            target: getAddress(get.tombByPid(pid).lpAddress),
            function: 'allowance',
            args: [account(), contractAddress],
          },
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'totalSupply', args: [] },
        ]
        multi.multiCall(pancakePairAbi, inputs)
          .then(lpRes => {
            const lpTokenRes = lpRes[1]
            store.dispatch(updateTombPoolInfo(pid, {
              allocPoint: new BigNumber(drFrankensteinRes[0].allocPoint.toString()),
              minimumStake: new BigNumber(drFrankensteinRes[0].minimumStake.toString()),
              totalStaked: new BigNumber(lpTokenRes[0].toString()),
              lpTotalSupply: new BigNumber(lpTokenRes[3].toString()),
              reserves: [new BigNumber(lpTokenRes[1]._reserve0.toString()), new BigNumber(lpTokenRes[1]._reserve1.toString())],
            }))
            store.dispatch(updateTombUserInfo(pid, {
              amount: new BigNumber(drFrankensteinRes[1].amount.toString()),
              tokenWithdrawalDate: drFrankensteinRes[1].tokenWithdrawalDate,
              lpAllowance: new BigNumber(lpTokenRes[2].toString()),
              pendingZombie: new BigNumber(drFrankensteinRes[2].toString()),
            }))
            if (everyUpdateObj) {
              everyUpdateObj.setUpdate(!everyUpdateObj.update)
            }
            if (updateUserObj && !updateUserObj.update) {
              updateUserObj.setUpdate(!updateUserObj.update)
            }
          })
      })
  } else {
    getDrFrankensteinContract().methods.poolInfo(pid).call()
      .then(poolInfoRes => {
        const inputs = [
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'balanceOf', args: [contractAddress] },
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'getReserves', args: [] },
          { target: getAddress(get.tombByPid(pid).lpAddress), function: 'totalSupply', args: [] },
        ]
        multi.multiCall(pancakePairAbi, inputs)
          .then(lpRes => {
            const lpTokenRes = lpRes[1]
            store.dispatch(updateTombPoolInfo(pid, {
              allocPoint: new BigNumber(poolInfoRes.allocPoint),
              minimumStake: new BigNumber(poolInfoRes.minimumStake),
              totalStaked: new BigNumber(lpTokenRes[0].toString()),
              lpTotalSupply: new BigNumber(lpTokenRes[2].toString()),
              reserves: [new BigNumber(lpTokenRes[1]._reserve0.toString()), new BigNumber(lpTokenRes[1]._reserve1.toString())],
            }))
          })
        if (everyUpdateObj) {
          everyUpdateObj.setUpdate(!everyUpdateObj.update)
        }
        if (updatePoolObj && !updatePoolObj.update) {
          updatePoolObj.setUpdate(!updatePoolObj.update)
        }
      })
  }
}

export const initialTombData = (multi: any, updatePoolObj?: { update: boolean, setUpdate: any }, updateUserObj?: { update: boolean, setUpdate: any }) => {
  get.tombs().forEach(t => {
    tomb(t.pid, multi, updatePoolObj, updateUserObj)
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

export const auction = (
  id: number,
  mausoleum: any,
  multi: any,
  updateAuctionObj?: { update: boolean, setUpdate: any },
  updateUserObj?: { update: boolean, setUpdate: any },
  everyUpdateObj?: { update: boolean, setUpdate: any },
) => {
  const { aid, version } = auctionById(id)

  if (account()) {
    mausoleum.methods.bidsLength(aid).call()
      .then(bidsLengthRes => {
        const inputs = [
          { target: getMausoleumAddress(version), function: 'userInfo', args: [aid, account()] },
          { target: getMausoleumAddress(version), function: 'unlockFeeInBnb', args: [aid] },
        ]
        for (let x = parseInt(bidsLengthRes) - 5; x <= parseInt(bidsLengthRes); x++) {
          if (x - 1 >= 0) {
            inputs.push({ target: getMausoleumAddress(version), function: 'bidInfo', args: [aid, x - 1] })
          }
        }
        multi.multiCall(mausoleumAbi, inputs)
          .then(res => {
            const start = parseInt(bidsLengthRes) - 6
            let index = start < -1 ? -1 : parseInt(bidsLengthRes) - 6
            const bids = res[1].slice(2, res[1].length).map(bid => {
              index++
              return {
                id: index,
                amount: new BigNumber(bid.amount.toString()),
                bidder: bid.bidder,
              }
            })

            const userInfoRes = res[1][0]
            store.dispatch(updateAuctionInfo(
              id,
              {
                lastBidId: parseInt(bidsLengthRes) - 1,
                bids,
                unlockFeeInBnb: new BigNumber(res[1][1].toString())
              },
            ))
            store.dispatch(updateAuctionUserInfo(
              id,
              {
                bid: new BigNumber(userInfoRes.bid.toString()),
                paidUnlockFee: userInfoRes.paidUnlockFee,
              },
            ))
            if (updateUserObj && !updateUserObj.update) {
              updateUserObj.setUpdate(!updateUserObj.update)
            }
          })
          .catch(() => {
            console.log('multicall failed')
          })
      })
  } else {
    mausoleum.methods.bidsLength(aid).call()
      .then(bidsLengthRes => {
        const inputs = [{ target: getMausoleumAddress(version), function: 'unlockFeeInBnb', args: [aid] }]
        for (let x = parseInt(bidsLengthRes) - 5; x <= parseInt(bidsLengthRes); x++) {
          if (x - 1 >= 0) {
            inputs.push({ target: getMausoleumAddress(version), function: 'bidInfo', args: [aid, x - 1] })
          }
        }
        multi.multiCall(mausoleumAbi, inputs)
          .then(res => {
            const start = parseInt(bidsLengthRes) - 6
            let index = start < -1 ? -1 : parseInt(bidsLengthRes) - 6
            const bids = res[1].slice(1, res[1].length).map(bid => {
              index++
              return {
                id: index,
                amount: new BigNumber(bid.amount.toString()),
                bidder: bid.bidder,
              }
            })

            store.dispatch(updateAuctionInfo(
              id,
              {
                lastBidId: parseInt(bidsLengthRes) - 1,
                bids,
                unlockFeeInBnb: new BigNumber(res[1][0].toString())
              },
            ))
            if (updateAuctionObj && !updateAuctionObj.update) {
              updateAuctionObj.setUpdate(!updateAuctionObj.update)
            }
          })
          .catch(() => {
            console.log('multicall failed')
          })
      })
  }
}

export const initialSpawningPoolData = (multi: any, zombie: any, setPoolData?: any, setUserData?: any) => {
  get.spawningPools().forEach(sp => {
    spawningPool(sp.id, multi, zombie, setPoolData, setUserData)
  })
}

const zombiePriceBnb = (setZombiePrice?: any) => {
  getPancakePair(getAddress(zmbeBnbTomb().lpAddress)).methods.getReserves().call()
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