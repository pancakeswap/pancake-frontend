import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256, { from: account })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  try {
    if (pid === 0) {
      const tx = await masterChefContract.enterStaking(
        new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
        { from: account },
      )
      await tx.wait()
      return tx.hash
    }

    const tx = await masterChefContract.deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      { from: account },
    )
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const sousStake = async (sousChefContract, amount, account) => {
  try {
    const tx = await sousChefContract.deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), {
      from: account,
    })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  try {
    const tx = await sousChefContract.deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), {
      from: account,
    })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  try {
    if (pid === 0) {
      const tx = await masterChefContract.leaveStaking(
        new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
        { from: account },
      )
      await tx.wait()
      return tx.hash
    }
    const tx = await masterChefContract.withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      { from: account },
    )
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  try {
    // shit code: hard fix for old CTK and BLK
    if (sousChefContract.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
      const tx = await sousChefContract.emergencyWithdraw({ from: account })
      await tx.wait()
      return tx.hash
    }
    if (sousChefContract.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
      const tx = await sousChefContract.emergencyWithdraw({ from: account })
      await tx.wait()
      return tx.hash
    }
    const tx = await sousChefContract.withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), {
      from: account,
    })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  try {
    const tx = await sousChefContract.emergencyWithdraw({ from: account })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const harvest = async (masterChefContract, pid, account) => {
  try {
    if (pid === 0) {
      const tx = await masterChefContract.leaveStaking('0', { from: account })
      await tx.wait()
      return tx.hash
    }
    const tx = await masterChefContract.deposit(pid, '0', { from: account })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const soushHarvest = async (sousChefContract, account) => {
  try {
    const tx = await sousChefContract.deposit('0', { from: account })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  try {
    const tx = await sousChefContract.deposit(new BigNumber(0), { from: account })
    await tx.wait()
    return tx.hash
  } catch (e) {
    return e
  }
}
