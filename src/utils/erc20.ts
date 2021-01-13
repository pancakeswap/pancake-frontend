import Web3 from 'web3'
import { provider as ProviderType } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import erc20 from 'config/abi/erc20.json'

export const getContract = (provider: ProviderType, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract((erc20 as unknown) as AbiItem, address)
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods.allowance(account, masterChefContract.options.address).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getTokenBalance = async (
  provider: ProviderType,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const contract = getContract(provider, tokenAddress)
  try {
    const balance: string = await contract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}
