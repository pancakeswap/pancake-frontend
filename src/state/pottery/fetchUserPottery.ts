import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBep20Contract, getPotteryVaultContract, getPotteryDrawContract } from 'utils/contractHelpers'
import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import { PotteryDepositStatus } from 'state/types'
import { multicallv2 } from 'utils/multicall'

const potteryDrawContract = getPotteryDrawContract()

export const fetchPotterysAllowance = async (account: string, potteryVaultAddress: string) => {
  try {
    const contract = getBep20Contract(tokens.cake.address)
    const allowances = await contract.allowance(account, potteryVaultAddress)
    return new BigNumber(allowances.toString()).toJSON()
  } catch (error) {
    console.error('Failed to fetch pottery user allowance', error)
    return BIG_ZERO.toJSON()
  }
}

export const fetchVaultUserData = async (account: string, potteryVaultAddress: string) => {
  try {
    const potteryVaultContract = getPotteryVaultContract(potteryVaultAddress)
    const balance = await potteryVaultContract.balanceOf(account)
    const previewDeposit = await potteryVaultContract.previewRedeem(balance)
    return {
      previewDepositBalance: new BigNumber(previewDeposit.toString()).toJSON(),
      stakingTokenBalance: new BigNumber(balance.toString()).toJSON(),
    }
  } catch (error) {
    console.error('Failed to fetch pottery vault user data', error)
    return {
      previewDepositBalance: BIG_ZERO.toJSON(),
      stakingTokenBalance: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchUserDrawData = async (account: string) => {
  try {
    const [reward, winCount] = await potteryDrawContract.userInfos(account)
    return {
      rewards: new BigNumber(reward.toString()).toJSON(),
      winCount: new BigNumber(winCount.toString()).toJSON(),
    }
  } catch (error) {
    console.error('Failed to fetch pottery user draw data', error)
    return {
      rewards: BIG_ZERO.toJSON(),
      winCount: BIG_ZERO.toString(),
    }
  }
}

export const fetchWithdrawAbleData = async (account: string, potteryVaultAddress: string) => {
  try {
    const potteryVaultContract = getPotteryVaultContract(potteryVaultAddress)
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getUserPotterWithdrawAbleData($account: ID!) {
          withdrawals(first: 30, where: { user: $account }) {
            id
            shares
            depositDate
            vault {
              id
              status
            }
          }
        }
      `,
      { account: account.toLowerCase() },
    )

    const withdrawAbleData = await Promise.all(
      response.withdrawals.map(async ({ id, shares, depositDate, vault }) => {
        const previewRedeem = await potteryVaultContract.previewRedeem(shares)
        return {
          id,
          shares,
          depositDate,
          previewRedeem: new BigNumber(previewRedeem.toString()).toJSON(),
          status: PotteryDepositStatus[vault.status],
          potteryVaultAddress: vault.id,
        }
      }),
    )

    return withdrawAbleData
  } catch (error) {
    console.error('Failed to fetch withdrawable data', error)
    return []
  }
}
