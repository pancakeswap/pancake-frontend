import { ethers } from 'ethers'

import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const getFarms = (sushi) => {
  return sushi
    ? sushi.contracts.pools.map(
        ({ pid, name, symbol, icon, tokenAddress, lpAddress, lpContract }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          earnToken: 'sushi',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
        }),
      )
    : []
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingSushi(pid, account).call()
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

//

export const getPoolStartTime = async (masterChefContract) => {
  return await masterChefContract.methods.starttime().call()
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const getPoolContracts = async (yam) => {
  const pools = Object.keys(yam.contracts)
    .filter((c) => c.indexOf('_pool') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = yam.contracts[cur]
      return newAcc
    }, {})
  return pools
}

// export const getStaked = async (yam, pool, account) => {
//   return yam.toBigN(await pool.methods.balanceOf(account).call())
// }

export const getCurrentPrice = async (yam) => {
  // FORBROCK: get current YAM price
  return yam.toBigN(await yam.contracts.rebaser.methods.getCurrentTWAP().call())
}

export const getTargetPrice = async (yam) => {
  return yam.toBigN(1).toFixed(2)
}

export const getCirculatingSupply = async (yam) => {
  let now = await yam.web3.eth.getBlock('latest')
  let scalingFactor = yam.toBigN(
    await yam.contracts.yam.methods.yamsScalingFactor().call(),
  )
  let starttime = yam
    .toBigN(await yam.contracts.eth_pool.methods.starttime().call())
    .toNumber()
  let timePassed = now['timestamp'] - starttime
  if (timePassed < 0) {
    return 0
  }
  let yamsDistributed = yam.toBigN((8 * timePassed * 250000) / 625000) //yams from first 8 pools
  let starttimePool2 = yam
    .toBigN(await yam.contracts.ycrv_pool.methods.starttime().call())
    .toNumber()
  timePassed = now['timestamp'] - starttime
  let pool2Yams = yam.toBigN((timePassed * 1500000) / 625000) // yams from second pool. note: just accounts for first week
  let circulating = pool2Yams
    .plus(yamsDistributed)
    .times(scalingFactor)
    .div(10 ** 36)
    .toFixed(2)
  return circulating
}

export const getNextRebaseTimestamp = async (yam) => {
  try {
    let now = await yam.web3.eth.getBlock('latest').then((res) => res.timestamp)
    let interval = 43200 // 12 hours
    let offset = 28800 // 8am/8pm utc
    let secondsToRebase = 0
    if (await yam.contracts.rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
        secondsToRebase = interval - (now % interval) + offset
      } else {
        secondsToRebase = offset - (now % interval)
      }
    } else {
      let twap_init = yam
        .toBigN(await yam.contracts.rebaser.methods.timeOfTWAPInit().call())
        .toNumber()
      if (twap_init > 0) {
        let delay = yam
          .toBigN(await yam.contracts.rebaser.methods.rebaseDelay().call())
          .toNumber()
        let endTime = twap_init + delay
        if (endTime % interval > offset) {
          secondsToRebase = interval - (endTime % interval) + offset
        } else {
          secondsToRebase = offset - (endTime % interval)
        }
        return endTime + secondsToRebase
      } else {
        return now + 13 * 60 * 60 // just know that its greater than 12 hours away
      }
    }
    return secondsToRebase
  } catch (e) {
    console.log(e)
  }
}

export const getTotalSupply = async (yam) => {
  return await yam.contracts.yam.methods.totalSupply().call()
}

export const getStats = async (yam) => {
  const curPrice = await getCurrentPrice(yam)
  const circSupply = await getCirculatingSupply(yam)
  const nextRebase = await getNextRebaseTimestamp(yam)
  const targetPrice = await getTargetPrice(yam)
  const totalSupply = await getTotalSupply(yam)
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply,
  }
}

export const vote = async (yam, account) => {
  return yam.contracts.gov.methods.castVote(0, true).send({ from: account })
}

export const delegate = async (yam, account) => {
  return yam.contracts.yam.methods
    .delegate('0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84')
    .send({ from: account })
}

export const didDelegate = async (yam, account) => {
  return (
    (await yam.contracts.yam.methods.delegates(account).call()) ===
    '0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84'
  )
}

export const getVotes = async (yam) => {
  const votesRaw = new BigNumber(
    await yam.contracts.yam.methods
      .getCurrentVotes('0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84')
      .call(),
  ).div(10 ** 24)
  return votesRaw
}

export const getScalingFactor = async (yam) => {
  return new BigNumber(
    await yam.contracts.yam.methods.yamsScalingFactor().call(),
  )
}

export const getDelegatedBalance = async (yam, account) => {
  return new BigNumber(
    await yam.contracts.yam.methods.balanceOfUnderlying(account).call(),
  ).div(10 ** 24)
}

export const migrate = async (yam, account) => {
  return yam.contracts.yamV2migration.methods.migrate().send({ from: account })
}

export const getMigrationEndTime = async (yam) => {
  return yam
    .toBigN(await yam.contracts.yamV2migration.methods.startTime().call())
    .plus(yam.toBigN(86400 * 3))
    .toNumber()
}
