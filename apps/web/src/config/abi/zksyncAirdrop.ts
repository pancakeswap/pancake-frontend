export const zkSyncAirDropABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'campaign_',
        type: 'tuple',
        internalType: 'struct Airdrop.Campaign',
        components: [
          { name: 'id', type: 'uint96', internalType: 'uint96' },
          { name: 'rewardToken', type: 'address', internalType: 'address' },
          { name: 'endTime', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'canClaim',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'proof', type: 'bytes32[]', internalType: 'bytes32[]' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claim',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'proof', type: 'bytes32[]', internalType: 'bytes32[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimedAmounts',
    inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Claimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const
