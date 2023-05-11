import BigNumber from 'bignumber.js'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBep20Contract, getPotteryVaultContract, getPotteryDrawContract } from 'utils/contractHelpers'
import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import { PotteryDepositStatus } from 'state/types'
import { Address } from 'wagmi'
import { multicall } from '@wagmi/core'
import { ChainId } from '@pancakeswap/sdk'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'

const potteryDrawContract = getPotteryDrawContract()

export const fetchPotterysAllowance = async (account: Address, potteryVaultAddress: Address) => {
  try {
    const contract = getBep20Contract(bscTokens.cake.address)
    const allowances = await contract.allowance(account, potteryVaultAddress)
    return new BigNumber(allowances.toString()).toJSON()
  } catch (error) {
    console.error('Failed to fetch pottery user allowance', error)
    return BIG_ZERO.toJSON()
  }
}

export const fetchVaultUserData = async (account: Address, potteryVaultAddress: Address) => {
  try {
    const potteryVaultContract = getPotteryVaultContract(potteryVaultAddress)
    const balance = await potteryVaultContract.read.balanceOf([account])
    const previewDeposit = await potteryVaultContract.read.previewRedeem([balance])
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

export const fetchWithdrawAbleData = async (account: Address) => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getUserPotteryWithdrawAbleData($account: ID!) {
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
        const [previewRedeem, totalSupply, totalLockCake, balanceOf] = await multicall({
          chainId: ChainId.BSC,
          allowFailure: false,
          contracts: [
            {
              address: vault.id,
              abi: potteryVaultABI,
              functionName: 'previewRedeem',
              args: [BigInt(shares)],
            },
            {
              address: vault.id,
              abi: potteryVaultABI,
              functionName: 'totalSupply',
            },
            {
              address: vault.id,
              abi: potteryVaultABI,
              functionName: 'totalLockCake',
            },
            {
              address: vault.id,
              abi: potteryVaultABI,
              functionName: 'balanceOf',
              args: [account],
            },
          ],
        })

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
