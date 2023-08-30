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
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct MultiCall.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'multicall',
    outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct MultiCall.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'multicallWithGas',
    outputs: [
      { internalType: 'bytes[]', name: 'results', type: 'bytes[]' },
      { internalType: 'uint256[]', name: 'gasUsed', type: 'uint256[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct MultiCall.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'gasBuffer', type: 'uint256' },
    ],
    name: 'multicallWithGasLimitation',
    outputs: [
      { internalType: 'bytes[]', name: 'results', type: 'bytes[]' },
      { internalType: 'uint256', name: 'lastSuccessIndex', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
