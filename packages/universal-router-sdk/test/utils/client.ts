import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'
import ERC20ABI from '../../src/abis/ERC20.json'

import { Token } from '@pancakeswap/swap-sdk-core'
import { ethers } from 'ethers'
import { getProvider } from './pancakeswapData'
const abi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokens', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokens', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'tokenOwner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'drip',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokens', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokens', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    name: 'approveAndCall',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'newOwner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'tokens', type: 'uint256' },
    ],
    name: 'transferAnyERC20Token',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: 'tokenOwner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: 'remaining', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'tokens', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenOwner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'tokens', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
]
export type viemAddress = `0x${string}`
export const getTestSigner = () =>
  privateKeyToAccount('0xbe69567da8668dae832436a18c303ed76836f008dc5e3e3b5eee1684154a7ddd')

const goerliTestnetClient = createWalletClient({
  account: getTestSigner(),
  chain: goerli,
  transport: http('https://goerli.infura.io/v3/3f4ad76a6b444342bde910d098ff8a4e'),
})

const goerliTestnetPublicClient = createPublicClient({
  chain: goerli,
  transport: http('https://goerli.infura.io/v3/3f4ad76a6b444342bde910d098ff8a4e'),
})

export const getViemClient = () => {
  return { goerliTestnetClient, goerliTestnetPublicClient }
}

export const getBalances = async (token: Token) => {
  const nativeBalance = await goerliTestnetPublicClient.getBalance({
    address: '0x13E7f71a3E8847399547CE127B8dE420B282E4E4',
  })

  const tokenBalance = await goerliTestnetPublicClient.readContract({
    address: token.address as viemAddress,
    abi,
    functionName: 'balanceOf',
  })
  return { nativeBalance, tokenBalance }
}

export const getBalancesEthers = async (token: Token) => {
  const nativeBalance = await goerliTestnetPublicClient.getBalance({
    address: '0x13E7f71a3E8847399547CE127B8dE420B282E4E4'
  })

  const contract = new ethers.Contract(token.address, ERC20ABI, getProvider())
  const tokenBalance = await contract.balanceOf('0x13E7f71a3E8847399547CE127B8dE420B282E4E4')
  return { nativeBalance: Number(nativeBalance), tokenBalance: Number(tokenBalance) }
}
