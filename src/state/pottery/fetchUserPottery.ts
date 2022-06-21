import { getPotteryVaultAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBep20Contract, getPotteryVaultContract, getPotteryDrawContract } from 'utils/contractHelpers'

const potteryVaultAddress = getPotteryVaultAddress()
const potteryVaultContract = getPotteryVaultContract()
const potteryDrawContract = getPotteryDrawContract()

export const fetchPotterysAllowance = async (account) => {
  try {
    const contract = getBep20Contract(tokens.cake.address)
    const allowances = await contract.allowance(account, potteryVaultAddress)
    return new BigNumber(allowances.toString()).toJSON()
  } catch {
    return BIG_ZERO.toJSON()
  }
}

export const fetchVaultUserData = async (account: string) => {
  try {
    const balance = await potteryVaultContract.balanceOf(account)
    const previewDeposit = await potteryVaultContract.previewDeposit(balance)
    return {
      previewDepositBalance: new BigNumber(previewDeposit.toString()).toJSON(),
      stakingTokenBalance: new BigNumber(balance.toString()).toJSON(),
    }
  } catch {
    return {
      previewDepositBalance: BIG_ZERO.toJSON(),
      stakingTokenBalance: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchDrawUserData = async (account: string) => {
  try {
    const [reward, winCount] = await potteryDrawContract.userInfos(account)
    return {
      rewards: new BigNumber(reward.toString()).toJSON(),
      winCount: new BigNumber(winCount.toString()).toJSON(),
    }
  } catch (error) {
    return {
      rewards: BIG_ZERO.toJSON(),
      winCount: BIG_ZERO.toString(),
    }
  }
}
