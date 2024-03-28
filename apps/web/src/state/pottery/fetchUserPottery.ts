import { ChainId } from '@pancakeswap/chains'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import { gql, request } from 'graphql-request'
import { PotteryDepositStatus } from 'state/types'
import { getBep20Contract, getPotteryDrawContract, getPotteryVaultContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'

const potteryDrawContract = getPotteryDrawContract()

export const fetchPotterysAllowance = async (account: Address, potteryVaultAddress: Address) => {
  try {
    const contract = getBep20Contract(bscTokens.cake.address)
    const allowances = await contract.read.allowance([account, potteryVaultAddress])
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

export const fetchUserDrawData = async (account: Address) => {
  try {
    const [reward, winCount] = await potteryDrawContract.read.userInfos([account])
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

    const bscClient = publicClient({ chainId: ChainId.BSC })

    const withdrawalsData = await Promise.all(
      response.withdrawals.map(async ({ id, shares, depositDate, vault }) => {
        const [previewRedeem, totalSupply, totalLockCake, balanceOf] = await bscClient.multicall({
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
