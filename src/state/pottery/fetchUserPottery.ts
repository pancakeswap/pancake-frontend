import erc20ABI from 'config/abi/erc20.json'
import multicallv2 from 'utils/multicall'
import { getPotteryVaultAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPotterysAllowance = async (account) => {
  try {
    const allowances = await multicallv2(erc20ABI, [
      {
        address: tokens.cake.address,
        name: 'allowance',
        params: [account, getPotteryVaultAddress()],
      },
    ])

    return new BigNumber(allowances.toString()).toJSON()
  } catch {
    return BIG_ZERO.toJSON()
  }
}
