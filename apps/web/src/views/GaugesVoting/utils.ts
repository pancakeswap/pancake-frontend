import { Address, encodePacked, keccak256, zeroAddress } from 'viem'

export const getGaugeHash = (gaugeAddress: Address = zeroAddress, chainId: number = 0) => {
  return keccak256(encodePacked(['address', 'uint256'], [gaugeAddress, BigInt(chainId || 0)]))
}
