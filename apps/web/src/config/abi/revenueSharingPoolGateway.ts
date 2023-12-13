export const revenueSharingPoolGatewayABI = [
  {
    inputs: [
      { internalType: 'address[]', name: '_revenueSharingPools', type: 'address[]' },
      { internalType: 'address', name: '_for', type: 'address' },
    ],
    name: 'claimMultiple',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_revenueSharingPools', type: 'address[]' },
      { internalType: 'address', name: '_for', type: 'address' },
    ],
    name: 'claimMultipleWithoutProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
