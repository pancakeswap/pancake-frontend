export const iMulticallABI = [
  {
    inputs: [],
    name: 'gasLeft',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gaslimit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        internalType: 'struct MultiCallV2.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'multicall',
    outputs: [
      { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
      {
        components: [
          { internalType: 'bool', name: 'success', type: 'bool' },
          { internalType: 'uint256', name: 'gasUsed', type: 'uint256' },
          { internalType: 'bytes', name: 'returnData', type: 'bytes' },
        ],
        internalType: 'struct MultiCallV2.Result[]',
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'gasLimit', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        internalType: 'struct MultiCallV2.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'gasBuffer', type: 'uint256' },
    ],
    name: 'multicallWithGasLimitation',
    outputs: [
      { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
      {
        components: [
          { internalType: 'bool', name: 'success', type: 'bool' },
          { internalType: 'uint256', name: 'gasUsed', type: 'uint256' },
          { internalType: 'bytes', name: 'returnData', type: 'bytes' },
        ],
        internalType: 'struct MultiCallV2.Result[]',
        name: 'returnData',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'lastSuccessIndex', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
