import BigNumber from 'bignumber.js'
import { bscTokens } from 'config/constants/tokens'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBep20Contract, getPotteryVaultContract, getPotteryDrawContract } from 'utils/contractHelpers'
import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import { PotteryDepositStatus } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'

const potteryDrawContract = getPotteryDrawContract()

export const fetchPotterysAllowance = async (account: string, potteryVaultAddress: string) => {
  try {
    const contract = getBep20Contract(bscTokens.cake.address)
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

export const fetchWithdrawAbleData = async (account: string) => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getUserPotterWithdrawAbleData($account: ID!) {
          withdrawals(first: 1000, where: { user: $account }) {
            id
            shares
            depositDate
            vault {
              id
              status
              lockDate
            }
          }
        }
      `,
      { account: account.toLowerCase() },
    )

    const withdrawalsData = await Promise.all(
      response.withdrawals.map(async ({ id, shares, depositDate, vault }) => {
        const calls = [
          {
            address: vault.id,
            name: 'previewRedeem',
            params: [shares],
          },
          {
            address: vault.id,
            name: 'totalSupply',
          },
          {
            address: vault.id,
            name: 'totalLockCake',
          },
          {
            address: vault.id,
            name: 'balanceOf',
            params: [account],
          },
        ]
        const [[previewRedeem], [totalSupply], [totalLockCake], [balanceOf]] = await multicallv2(potteryVaultAbi, calls)

        return {
          id,
          shares,
          depositDate,
          previewRedeem: new BigNumber(previewRedeem.toString()).toJSON(),
          status: PotteryDepositStatus[vault.status],
          potteryVaultAddress: vault.id,
          totalSupply: new BigNumber(totalSupply.toString()).toJSON(),
          totalLockCake: new BigNumber(totalLockCake.toString()).toJSON(),
          lockedDate: vault.lockDate,
          balanceOf: new BigNumber(balanceOf.toString()).toJSON(),
        }
      }),
    )

    // eslint-disable-next-line array-callback-return, consistent-return
    const withdrawAbleData = withdrawalsData.filter((data) => {
      if (data.status === PotteryDepositStatus.UNLOCK && data.balanceOf === '0') {
        return null
      }
      return data
    })

    return withdrawAbleData
  } catch (error) {
    console.error('Failed to fetch withdrawable data', error)
    return []
  }
}
