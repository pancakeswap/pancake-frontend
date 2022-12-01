import BigNumber from 'bignumber.js'
import { multicallv3 } from 'utils/multicall'
import potteryVaultAbi from 'config/abi/potteryVaultAbi.json'
import { getPotteryDrawAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { PotteryDepositStatus } from 'state/types'
import { bscTokens } from '@pancakeswap/tokens'
import { getBep20Contract } from 'utils/contractHelpers'
import { request, gql } from 'graphql-request'
import { GRAPH_API_POTTERY } from 'config/constants/endpoints'
import potteryDrawAbi from 'config/abi/potteryDrawAbi.json'

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

export const fetchPublicPotteryValue = async (potteryVaultAddress: string) => {
  try {
    const calls = [
      'getStatus',
      'totalLockCake',
      'totalSupply',
      'lockStartTime',
      'getLockTime',
      'getMaxTotalDeposit',
    ].map((method) => ({
      abi: potteryVaultAbi,
      address: potteryVaultAddress,
      name: method,
    }))

    const getPotCall = {
      abi: potteryDrawAbi,
      address: potteryDrawAddress,
      name: 'getPot',
      params: [potteryVaultAddress],
    }

    const [
      getStatus,
      [totalLockCake],
      [totalSupply],
      [lockStartTime],
      getLockTime,
      getMaxTotalDeposit,
      [[lastDrawId, totalPrize]],
    ] = await multicallv3({ calls: [...calls, getPotCall] })

    return {
      lastDrawId: new BigNumber(lastDrawId.toString()).toJSON(),
      totalPrize: new BigNumber(totalPrize.toString()).toJSON(),
      getStatus: getStatus[0],
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

export const fetchTotalLockedValue = async (potteryVaultAddress: string) => {
  try {
    const contract = getBep20Contract(bscTokens.cake.address)
    const totalLocked = await contract.balanceOf(potteryVaultAddress)

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
