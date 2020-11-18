import BigNumber from 'bignumber.js'
import get from 'lodash/get'
import memoize from 'lodash/memoize'
import { ethers } from 'ethers'
import { poolsConfig } from './lib/constants'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
export const getSyrupAddress = (sushi) => {
  return sushi && sushi.syrupAddress
}
export const getSyrupContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.syrup
}
export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}
export const getSousChefContract = (sushi, sousId) => {
  return sushi && sushi.contracts && sushi.contracts.sousChefs.filter((chef) => chef.sousId === sousId)[0]?.sousContract
}

export const getFarms = memoize((sushi) => {
  const pools = get(sushi, 'contracts.pools', [])
  return pools.map((pool) => ({ ...pool, id: pool.symbol, lpToken: pool.symbol, lpTokenAddress: pool.lpAddress }))
})

export const getPools = (sushi) => {
  return get(sushi, 'contracts.sousChefs', poolsConfig)
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods.totalAllocPoint().call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingCake(pid, account).call()
}

export const getSousEarned = async (sousChefContract, account) => {
  return sousChefContract.methods.pendingReward(account).call()
}

export const getTotalStaked = async (sushi, sousChefContract) => {
  const syrup = await getSyrupContract(sushi)
  const sushi2 = await getSushiContract(sushi)
  const syrupBalance = await syrup.methods.balanceOf(sousChefContract.options.address).call()
  const sushiBalance = await sushi2.methods.balanceOf(sousChefContract.options.address).call()
  return syrupBalance > sushiBalance ? syrupBalance : sushiBalance
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
  tokenSymbol,
) => {
  const tokenAmountWholeLP = await tokenContract.methods.balanceOf(lpContract.options.address).call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  const balance = await lpContract.methods.balanceOf(masterChefContract.options.address).call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods.balanceOf(lpContract.options.address).call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP).times(portionLp).div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth).times(portionLp).div(new BigNumber(10).pow(18))
  return {
    pid,
    tokenSymbol,
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }

  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousStake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // hard fix for old CTK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking('0')
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit('0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods.userInfo(pid, account).call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getSousStaked = async (sousChefContract, account) => {
  try {
    const { amount } = await sousChefContract.methods.userInfo(account).call()
    return new BigNumber(amount)
  } catch (err) {
    console.error(err)
    return new BigNumber(0)
  }
}

export const getSousStartBlock = async (sousChefContract) => {
  try {
    const startBlock = await sousChefContract.methods.startBlock().call()
    return startBlock
  } catch {
    return 0
  }
}
export const getSousEndBlock = async (sousChefContract) => {
  try {
    const endBlcok = await sousChefContract.methods.bonusEndBlock().call()
    return endBlcok
  } catch {
    return 0
  }
}
