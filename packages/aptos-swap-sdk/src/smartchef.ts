import { smartChefDeposit } from './generated/smartchef'

export abstract class SmartChef {
  public static deposit({
    stakeTokenAddress,
    rewardTokenAddress,
    uid,
    amount,
  }: {
    stakeTokenAddress: string
    rewardTokenAddress: string
    uid: string
    amount: string | bigint
  }) {
    return smartChefDeposit([amount], [stakeTokenAddress, rewardTokenAddress, uid])
  }
}
