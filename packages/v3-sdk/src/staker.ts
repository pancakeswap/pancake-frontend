import { BigintIsh, Token, validateAndParseAddress } from '@pancakeswap/sdk'
import { Address, encodeAbiParameters, encodeFunctionData, Hex, parseAbiParameters } from 'viem'
import { v3StakerABI } from './abi/V3Staker'
import { MethodParameters, toHex } from './utils/calldata'
import { Pool } from './entities'
import { Multicall } from './multicall'

export type FullWithdrawOptions = ClaimOptions & WithdrawOptions
/**
 * Represents a unique staking program.
 */
export interface IncentiveKey {
  /**
   * The token rewarded for participating in the staking program.
   */
  rewardToken: Token
  /**
   * The pool that the staked positions must provide in.
   */
  pool: Pool
  /**
   * The time when the incentive program begins.
   */
  startTime: BigintIsh
  /**
   * The time that the incentive program ends.
   */
  endTime: BigintIsh
  /**
   * The address which receives any remaining reward tokens at `endTime`.
   */
  refundee: string
}

/**
 * Options to specify when claiming rewards.
 */
export interface ClaimOptions {
  /**
   * The id of the NFT
   */
  tokenId: BigintIsh

  /**
   * Address to send rewards to.
   */
  recipient: string

  /**
   * The amount of `rewardToken` to claim. 0 claims all.
   */
  amount?: BigintIsh
}
/**
 * Options to specify when withdrawing a position.
 */
export interface WithdrawOptions {
  /**
   * Set when withdrawing. The position will be sent to `owner` on withdraw.
   */
  owner: string

  /**
   * Set when withdrawing. `data` is passed to `safeTransferFrom` when transferring the position from contract back to owner.
   */
  data?: string
}

export abstract class Staker {
  public static ABI = v3StakerABI

  protected constructor() {}

  private static INCENTIVE_KEY_ABI =
    'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'

  /**
   *  To claim rewards, must unstake and then claim.
   * @param incentiveKey The unique identifier of a staking program.
   * @param options Options for producing the calldata to claim. Can't claim unless you unstake.
   * @returns The calldatas for 'unstakeToken' and 'claimReward'.
   */
  private static encodeClaim(incentiveKey: IncentiveKey, options: ClaimOptions): Hex[] {
    const calldatas: Hex[] = []
    calldatas.push(
      encodeFunctionData({
        abi: Staker.ABI,
        functionName: 'unstakeToken',
        args: [this._encodeIncentiveKey(incentiveKey), BigInt(options.tokenId)],
      })
    )
    const recipient = validateAndParseAddress(options.recipient)
    const amount = options.amount ?? 0
    calldatas.push(
      encodeFunctionData({
        abi: Staker.ABI,
        functionName: 'claimReward',
        args: [incentiveKey.rewardToken.address, recipient, BigInt(amount)],
      })
    )
    return calldatas
  }

  /**
   *
   * Note:  A `tokenId` can be staked in many programs but to claim rewards and continue the program you must unstake, claim, and then restake.
   * @param incentiveKeys An IncentiveKey or array of IncentiveKeys that `tokenId` is staked in.
   * Input an array of IncentiveKeys to claim rewards for each program.
   * @param options ClaimOptions to specify tokenId, recipient, and amount wanting to collect.
   * Note that you can only specify one amount and one recipient across the various programs if you are collecting from multiple programs at once.
   * @returns
   */
  public static collectRewards(incentiveKeys: IncentiveKey | IncentiveKey[], options: ClaimOptions): MethodParameters {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]
    let calldatas: Hex[] = []

    for (let i = 0; i < incentiveKeys.length; i++) {
      // the unique program tokenId is staked in
      const incentiveKey = incentiveKeys[i]
      // unstakes and claims for the unique program
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, options))
      // re-stakes the position for the unique program
      calldatas.push(
        encodeFunctionData({
          abi: Staker.ABI,
          functionName: 'stakeToken',
          args: [this._encodeIncentiveKey(incentiveKey), BigInt(options.tokenId)],
        })
      )
    }
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   *
   * @param incentiveKeys A list of incentiveKeys to unstake from. Should include all incentiveKeys (unique staking programs) that `options.tokenId` is staked in.
   * @param withdrawOptions Options for producing claim calldata and withdraw calldata. Can't withdraw without unstaking all programs for `tokenId`.
   * @returns Calldata for unstaking, claiming, and withdrawing.
   */
  public static withdrawToken(
    incentiveKeys: IncentiveKey | IncentiveKey[],
    withdrawOptions: FullWithdrawOptions
  ): MethodParameters {
    let calldatas: Hex[] = []

    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]

    const claimOptions = {
      tokenId: withdrawOptions.tokenId,
      recipient: withdrawOptions.recipient,
      amount: withdrawOptions.amount,
    }

    for (let i = 0; i < incentiveKeys.length; i++) {
      const incentiveKey = incentiveKeys[i]
      calldatas = calldatas.concat(this.encodeClaim(incentiveKey, claimOptions))
    }
    const owner = validateAndParseAddress(withdrawOptions.owner)
    calldatas.push(
      encodeFunctionData({
        abi: Staker.ABI,
        functionName: 'withdrawToken',
        args: [BigInt(withdrawOptions.tokenId), owner, toHex(0)],
      })
    )
    return {
      calldata: Multicall.encodeMulticall(calldatas),
      value: toHex(0),
    }
  }

  /**
   *
   * @param incentiveKeys A single IncentiveKey or array of IncentiveKeys to be encoded and used in the data parameter in `safeTransferFrom`
   * @returns An IncentiveKey as a string
   */
  public static encodeDeposit(incentiveKeys: IncentiveKey | IncentiveKey[]): string {
    incentiveKeys = Array.isArray(incentiveKeys) ? incentiveKeys : [incentiveKeys]
    let data: string

    if (incentiveKeys.length > 1) {
      const keys: { rewardToken: Address; pool: Address; startTime: bigint; endTime: bigint; refundee: Address }[] = []
      for (let i = 0; i < incentiveKeys.length; i++) {
        const incentiveKey = incentiveKeys[i]
        keys.push(this._encodeIncentiveKey(incentiveKey))
      }
      data = encodeAbiParameters(parseAbiParameters([`${Staker.INCENTIVE_KEY_ABI}[]`]), [keys])
    } else {
      data = encodeAbiParameters(parseAbiParameters(Staker.INCENTIVE_KEY_ABI), [
        this._encodeIncentiveKey(incentiveKeys[0]),
      ])
    }
    return data
  }

  /**
   *
   * @param incentiveKey An `IncentiveKey` which represents a unique staking program.
   * @returns An encoded IncentiveKey to be read by viem
   */
  private static _encodeIncentiveKey(incentiveKey: IncentiveKey) {
    const { token0, token1, fee } = incentiveKey.pool
    const refundee = validateAndParseAddress(incentiveKey.refundee)
    return {
      rewardToken: incentiveKey.rewardToken.address,
      pool: Pool.getAddress(token0, token1, fee),
      startTime: BigInt(incentiveKey.startTime),
      endTime: BigInt(incentiveKey.endTime),
      refundee,
    }
  }
}
