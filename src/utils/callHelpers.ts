import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract
    .approve(masterChefContract.address, ethers.constants.MaxUint256, { from: account })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  if (pid === 0) {
    const tx = masterChefContract
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
    return tx.hash;
  }

  const tx = masterChefContract
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
  return tx.hash;
}

export const sousStake = async (sousChefContract, amount, account) => {
  const tx = sousChefContract
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
  return tx.hash;
}

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  const tx = sousChefContract
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
  return tx.hash;
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  if (pid === 0) {
    const tx = masterChefContract
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
    return tx.hash;
  }
  const tx = masterChefContract
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
  return tx.hash;
}

export const sousUnstake = async (sousChefContract, amount, account) => {
  // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    const tx = sousChefContract
      .emergencyWithdraw({ from: account })
    return tx.hash;
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    const tx = sousChefContract
      .emergencyWithdraw({ from: account })
    return tx.hash;
  }
  const tx = sousChefContract
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), { from: account })
  return tx.hash;
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  const tx = sousChefContract
    .emergencyWithdraw({ from: account })
  return tx.hash;
}

export const harvest = async (masterChefContract, pid, account) => {
  if (pid === 0) {
    const tx = await masterChefContract
      .leaveStaking('0', { from: account })
    return tx.hash;
  }
  const tx = await masterChefContract
    .deposit(pid, '0', { from: account })
  return tx.hash;
}

export const soushHarvest = async (sousChefContract, account) => {
  const tx = sousChefContract
    .deposit('0', { from: account })
  return tx.hash;
}

export const soushHarvestBnb = async (sousChefContract, account) => {
  const tx = sousChefContract
    .deposit(new BigNumber(0), { from: account })
  return tx.hash;
}
