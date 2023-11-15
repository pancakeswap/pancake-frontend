import { Address, encodePacked, keccak256 } from 'viem'

export const getGaugeHash = (gaugeAddress: Address, chainId: number) => {
  return keccak256(encodePacked(['address', 'uint256'], [gaugeAddress, BigInt(chainId)]))
}
