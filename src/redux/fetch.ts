import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import {
  getBep20Contract,
  getDrFrankensteinContract, getErc721Contract,
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
  updateGravePoolInfo,
  updateGraveUserInfo,
  updateNftTotalSupply,
  updateSpawningPoolInfo,
  updateSpawningPoolUserInfo,
  updateTombPoolInfo,
  updateTombUserInfo,
  updateAuctionInfo,
  updateAuctionUserInfo,
  updateNftUserInfo,
  updateDrFrankensteinTotalAllocPoint, updateBnbBalance,
} from './actions'
import {
  getAddress,
  getDrFrankensteinAddress,
  getMausoleumAddress,
  getSpawningPoolAddress,
} from '../utils/addressHelpers'
import tombs from './tombs'
import * as get from './get'
import spawningPoolAbi from '../config/abi/spawningPool.json'
import drFrankensteinAbi from '../config/abi/drFrankenstein.json'
import pancakePairAbi from '../config/abi/pancakePairAbi.json'
import mausoleumAbi from '../config/abi/mausoleum.json'
import mausoleumV3Abi from '../config/abi/mausoleumV3.json'
import { BIG_ZERO } from '../utils/bigNumber'
import { account, auctionById, zmbeBnbTomb } from './get'
import web3 from '../utils/web3'
import { multicallv2 } from '../utils/multicall'
import { getId } from '../utils'

export const initialData = (accountAddress: string, multi: any, setZombiePrice?: any) => {
  store.dispatch(updateAccount(accountAddress))
  const zombie = getZombieContract()
  const drFrankenstein = getDrFrankensteinContract()
  zombie.methods.totalSupply().call()
    .then(res => {
      store.dispatch(updateZombieTotalSupply(new BigNumber(res)))
    })

  zombie.methods.balanceOf(getDrFrankensteinAddress()).call()
    .then(res => {
      store.dispatch(updateDrFrankensteinZombieBalance(new BigNumber(res)))
    })

  bnbPriceUsd(setZombiePrice)

  tomb(getId(tombs[0].pid))

  nfts()

  if (accountAddress) {
    web3.eth.getBalance(accountAddress).then(res => {
      store.dispatch(updateBnbBalance(new BigNumber(res)))
    })

    zombie.methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
      .then(res => {
        store.dispatch(updateZombieAllowance(new BigNumber(res)))
      })

    drFrankenstein.methods.totalAllocPoint().call()
      .then(res => {
        store.dispatch(updateDrFrankensteinTotalAllocPoint(new BigNumber(res)))
      })

    zombie.methods.balanceOf(accountAddress).call()
      .then(res => {
        store.dispatch(updateZombieBalance(new BigNumber(res)))
      })
  }

  // initialGraveData()
}

export const tomb = (pid: number, updatePoolObj?: { update: number, setUpdate: any }, updateUserObj?: { update: number, setUpdate: any }, everyUpdateObj?: { update: boolean, setUpdate: any }) => {
  const address = getDrFrankensteinAddress()

  if (account()) {
    let calls = [
      { address, name: 'poolInfo', params: [pid] },
      { address, name: 'userInfo', params: [pid, get.account()] },
      { address, name: 'pendingZombie', params: [pid, get.account()] },
    ]
    multicallv2(drFrankensteinAbi, calls)
      .then(drFrankensteinRes => {
        calls = [
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'balanceOf', params: [address] },
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'getReserves', params: [] },
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'allowance', params: [account(), address] },
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'totalSupply', params: [] },
        ]
        multicallv2(pancakePairAbi, calls)
          .then(lpTokenRes => {
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
            if (updateUserObj) {
              updateUserObj.setUpdate(updateUserObj.update + 1)
            }
          })
      })
  } else {
    getDrFrankensteinContract().methods.poolInfo(pid).call()
      .then(poolInfoRes => {
        const calls = [
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'balanceOf', params: [address] },
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'getReserves', params: [] },
          { address: getAddress(get.tombByPid(pid).lpAddress), name: 'totalSupply', params: [] },
        ]
        multicallv2(pancakePairAbi, calls)
          .then(lpTokenRes => {
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
        if (updatePoolObj) {
          updatePoolObj.setUpdate(updatePoolObj.update + 1)
        }
      })
  }
}

export const initialTombData = (updatePoolObj?: { update: number, setUpdate: any }, updateUserObj?: { update: number, setUpdate: any }) => {
  let index = 0
  get.tombs().forEach(t => {
    tomb(
      getId(t.pid),
      updatePoolObj ? { update: updatePoolObj.update + index, setUpdate: updatePoolObj.setUpdate } : undefined,
      updateUserObj ? { update: updateUserObj.update + index, setUpdate: updateUserObj.setUpdate } : undefined,
    )
    index++
  })
}

export const grave = (pid: number, setUserInfoState?: { update: boolean, setUpdate: any }, setPoolInfoState?: { update: boolean, setUpdate: any }) => {
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
                setPoolInfoState.setUpdate(!setUserInfoState.update)
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
            setPoolInfoState.setUpdate(!setPoolInfoState.update)
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
              setUserInfoState.setUpdate(!setUserInfoState.update)
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

export const spawningPool = (id: number, zombie: any, poolUpdateObj?: { update: number, setUpdate: any }, userUpdateObj?: { update: number, setUpdate: any }) => {
  const address = getSpawningPoolAddress(id)
  let calls = [
    { address, name: 'rewardPerBlock', params: [] },
    { address, name: 'unlockFeeInBnb', params: [] },
    { address, name: 'minimumStake', params: [] },
    { address, name: 'minimumStakingTime', params: [] },
    { address, name: 'nftRevivalTime', params: [] },
  ]
  multicallv2(spawningPoolAbi, calls)
    .then(res => {
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
          if (poolUpdateObj) {
            poolUpdateObj.setUpdate(poolUpdateObj.update + 1)
          }
        })
    })
    .catch((res) => {
      console.log('res')
      console.log(res)
    })
  if (account()) {
    calls = [
      { address, name: 'userInfo', params: [account()] },
      { address, name: 'pendingReward', params: [account()] },
    ]

    multicallv2(spawningPoolAbi, calls)
      .then(res => {
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
            if (userUpdateObj) {
              userUpdateObj.setUpdate(userUpdateObj.update + 1)
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
  const v3 = version === 'v3'
  if (account()) {
    mausoleum.methods.bidsLength(aid).call()
      .then(bidsLengthRes => {
        const calls = [
          { address: getMausoleumAddress(version), name: 'userInfo', params: [aid, account()] },
          { address: getMausoleumAddress(version), name: 'auctionInfo', params: [aid] },
        ]
        if (!v3) {
          calls.push({ address: getMausoleumAddress(version), name: 'unlockFeeInBnb', params: [aid] })
        }
        for (let x = parseInt(bidsLengthRes) - 5; x <= parseInt(bidsLengthRes); x++) {
          if (x - 1 >= 0) {
            calls.push({ address: getMausoleumAddress(version), name: 'bidInfo', params: [aid, x - 1] })
          }
        }
        multicallv2(version === 'v3' ? mausoleumV3Abi : mausoleumAbi, calls)
          .then(res => {
            const start = parseInt(bidsLengthRes) - 6
            let index = start < -1 ? 0 : parseInt(bidsLengthRes) - 6

            const bids = res[1].slice((v3 ? 2 : 3), res[1].length).map(bid => {
              index++
              return {
                id: index,
                amount: new BigNumber(bid.amount.toString()),
                bidder: bid.bidder,
              }
            })

            const userInfoRes = res[1][0]
            const auctionInfoRes = v3 ? res[1][1] : res[1][2]
            store.dispatch(updateAuctionInfo(
              id,
              {
                lastBidId: parseInt(bidsLengthRes),
                bids,
                endDate: auctionInfoRes.endDate.toNumber(),
                finalized: auctionInfoRes.finalized,
                unlockFeeInBnb: v3 ? BIG_ZERO : new BigNumber(res[1][1].toString()),
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
            if (everyUpdateObj) {
              everyUpdateObj.setUpdate(!everyUpdateObj.update)
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
            const auctionInfoRes = v3 ? res[1][1] : res[1][2]

            const start = parseInt(bidsLengthRes) - 6
            let index = start < -1 ? 0 : parseInt(bidsLengthRes) - 6
            const bids = res[1].slice((v3 ? 2 : 3), res[1].length).map(bid => {
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
                lastBidId: parseInt(bidsLengthRes),
                bids,
                endDate: auctionInfoRes.endDate.toNumber(),
                finalized: auctionInfoRes.finalized,
                unlockFeeInBnb: v3 ? BIG_ZERO : new BigNumber(res[1][1].toString()),
              },
            ))
            if (updateAuctionObj && !updateAuctionObj.update) {
              updateAuctionObj.setUpdate(!updateAuctionObj.update)
            }
            if (everyUpdateObj) {
              everyUpdateObj.setUpdate(!everyUpdateObj.update)
            }
          })
          .catch((res) => {
            console.log(res)
          })
      })
  }
}

export const initialSpawningPoolData = (zombie: any, setPoolData?: { update: number, setUpdate: any }, setUserData?: { update: number, setUpdate: any }) => {
  let index = 0
  get.spawningPools().forEach(sp => {
    spawningPool(
      sp.id,
      zombie,
      setPoolData ? { update: setPoolData.update + index, setUpdate: setPoolData.setUpdate } : undefined,
      setUserData ? { update: setUserData.update + index, setUpdate: setUserData.setUpdate } : undefined,
    )
    index++
  })
}

export const nftUserInfo = (contract: any, updateUserObj: { update: boolean, setUpdate: any }, updateEveryObj?: { update: boolean, setUpdate: any }) => {
  if (account()) {
    const nftAddresses = get.nfts().map(nft => nft.address)
    contract.methods.massCheckOwnership(account(), nftAddresses).call()
      .then(res => {
        get.nfts().forEach((nft, index) => {
          store.dispatch(updateNftUserInfo(
            nft.id,
            {
              ownedIds: res[index],
            },
          ))
        })
        if (updateUserObj && !updateUserObj.update) {
          updateUserObj.setUpdate(!updateUserObj.update)
        }
        if (updateEveryObj) {
          updateEveryObj.setUpdate(!updateEveryObj.update)
        }
      })
      .catch(() => {
        console.log('massCheckOwnership failed')
      })
  }
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

const bnbPriceUsd = (setZombiePrice?: any) => {
  axios.get('https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD')
    .then(res => {
      store.dispatch(updateBnbPriceUsd(res.data.price))
      zombiePriceBnb(setZombiePrice)
    })
}

const nfts = () => {
  get.nfts().forEach(nft => {
    getErc721Contract(getAddress(nft.address)).methods.totalSupply().call()
      .then(res => {
        store.dispatch(updateNftTotalSupply(nft.id, new BigNumber(res)))
      })
  })
}
