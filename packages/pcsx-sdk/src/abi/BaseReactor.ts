export const baseReactorAbi = [
  {
    inputs: [],
    name: 'DeadlinePassed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'duplicateToken',
        type: 'address',
      },
    ],
    name: 'DuplicateFeeOutput',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'FeeTooLarge',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientEth',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feeToken',
        type: 'address',
      },
    ],
    name: 'InvalidFeeToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidReactor',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NativeTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'filler',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'swapper',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'Fill',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldFeeController',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newFeeController',
        type: 'address',
      },
    ],
    name: 'ProtocolFeeControllerSet',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'order',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'order',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
    ],
    name: 'executeBatch',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'order',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedOrder[]',
        name: 'orders',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    name: 'executeBatchWithCallback',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'order',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
        ],
        internalType: 'struct SignedOrder',
        name: 'order',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    name: 'executeWithCallback',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeController',
    outputs: [
      {
        internalType: 'contract IProtocolFeeController',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'permit2',
    outputs: [
      {
        internalType: 'contract IPermit2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newFeeController',
        type: 'address',
      },
    ],
    name: 'setProtocolFeeController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
