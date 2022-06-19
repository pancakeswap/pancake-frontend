import erc20ABI from 'config/abi/erc20.json'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'
import multicallv2 from 'utils/multicall'
import { getPotteryVaultAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBep20Contract, getPotteryVaultContract } from 'utils/contractHelpers'

const potteryVaultAddress = getPotteryVaultAddress()
const potteryVaultContract = getPotteryVaultContract()

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
    return {
      stakingTokenBalance: new BigNumber(balance.toString()).toJSON(),
    }
  } catch {
    return {
      stakingTokenBalance: BIG_ZERO.toJSON(),
    }
  }
}
