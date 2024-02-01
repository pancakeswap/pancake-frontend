import { ChainId } from '@pancakeswap/chains'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import { gql, request } from 'graphql-request'
import { PotteryDepositStatus } from 'state/types'
import { getPotteryDrawAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'

const potteryDrawAddress = getPotteryDrawAddress()

export const fetchLastVaultAddress = async () => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getLastVaultAddress($contract: ID!) {
          pottery(id: $contract) {
            id
            lastVaultAddress
          }
        }
      `,
      { contract: potteryDrawAddress },
    )

    const { lastVaultAddress } = response.pottery
    return lastVaultAddress
  } catch (error) {
    console.error('Failed to fetch last vault address', error)
    return ''
  }
}

export const fetchPublicPotteryValue = async (potteryVaultAddress: Address) => {
  try {
    const [
      getStatus,
      totalLockCake,
      totalSupply,
      lockStartTime,
      getLockTime,
      getMaxTotalDeposit,
      { lastDrawId, totalPrize },
    ] = await publicClient({ chainId: ChainId.BSC }).multicall({
      contracts: [
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'getStatus',
        },
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'totalLockCake',
        },
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'totalSupply',
        },
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'lockStartTime',
        },
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'getLockTime',
        },
        {
          abi: potteryVaultABI,
          address: potteryVaultAddress,
          functionName: 'getMaxTotalDeposit',
        },
        {
          abi: potteryDrawABI,
          address: potteryDrawAddress,
          functionName: 'getPot',
          args: [potteryVaultAddress],
        },
      ],
      allowFailure: false,
    })

    return {
      lastDrawId: new BigNumber(lastDrawId.toString()).toJSON(),
      totalPrize: new BigNumber(totalPrize.toString()).toJSON(),
      getStatus,
      totalLockCake: new BigNumber(totalLockCake.toString()).toJSON(),
      totalSupply: new BigNumber(totalSupply.toString()).toJSON(),
      lockStartTime: lockStartTime.toString(),
      lockTime: Number(getLockTime),
      maxTotalDeposit: new BigNumber(getMaxTotalDeposit.toString()).toJSON(),
    }
  } catch (error) {
    console.error('Failed to fetch public pottery value data', error)
    return {
      lastDrawId: BIG_ZERO.toJSON(),
      totalPrize: BIG_ZERO.toJSON(),
      getStatus: PotteryDepositStatus.BEFORE_LOCK,
      totalLockCake: BIG_ZERO.toJSON(),
      totalSupply: BIG_ZERO.toJSON(),
      lockStartTime: BIG_ZERO.toJSON(),
      lockTime: 0,
      maxTotalDeposit: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchTotalLockedValue = async (potteryVaultAddress: Address) => {
  try {
    const contract = getBep20Contract(bscTokens.cake.address)
    const totalLocked = await contract.read.balanceOf([potteryVaultAddress])

    return {
      totalLockedValue: new BigNumber(totalLocked.toString()).toJSON(),
    }
  } catch (error) {
    console.error('Failed to fetch total lock value', error)
    return {
      totalLockedValue: BIG_ZERO.toJSON(),
    }
  }
}

export const fetchLatestRoundId = async () => {
  try {
    const response = await request(
      GRAPH_API_POTTERY,
      gql`
        query getLatestRoundId {
          potteryVaultRounds(first: 1, orderDirection: desc, orderBy: roundId) {
            roundId
            winners
          }
        }
      `,
    )

    const winners = response.potteryVaultRounds[0]?.winners
    const latestRoundId = response.potteryVaultRounds[0]?.roundId

    return {
      latestRoundId: winners?.length > 0 ? latestRoundId || '' : latestRoundId - 1,
    }
  } catch (error) {
    console.error('Failed to fetch last roundId ', error)
    return {
      latestRoundId: '',
    }
  }
}
