export const orderQuoterAbi = [
  {
    inputs: [],
    name: 'OrdersLengthIncorrect',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'order',
        type: 'bytes',
      },
    ],
    name: 'getReactor',
    outputs: [
      {
        internalType: 'contract IReactor',
        name: 'reactor',
        type: 'address',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
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
    name: 'quote',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IReactor',
                name: 'reactor',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'swapper',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
              },
              {
                internalType: 'contract IValidationCallback',
                name: 'additionalValidationContract',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'additionalValidationData',
                type: 'bytes',
              },
            ],
            internalType: 'struct OrderInfo',
            name: 'info',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract ERC20',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct InputToken',
            name: 'input',
            type: 'tuple',
          },
          {
            components: [
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
            internalType: 'struct OutputToken[]',
            name: 'outputs',
            type: 'tuple[]',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
          {
            internalType: 'bytes32',
            name: 'hash',
            type: 'bytes32',
          },
        ],
        internalType: 'struct ResolvedOrder',
        name: 'result',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IReactor',
                name: 'reactor',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'swapper',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
              },
              {
                internalType: 'contract IValidationCallback',
                name: 'additionalValidationContract',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'additionalValidationData',
                type: 'bytes',
              },
            ],
            internalType: 'struct OrderInfo',
            name: 'info',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'contract ERC20',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'maxAmount',
                type: 'uint256',
              },
            ],
            internalType: 'struct InputToken',
            name: 'input',
            type: 'tuple',
          },
          {
            components: [
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
            internalType: 'struct OutputToken[]',
            name: 'outputs',
            type: 'tuple[]',
          },
          {
            internalType: 'bytes',
            name: 'sig',
            type: 'bytes',
          },
          {
            internalType: 'bytes32',
            name: 'hash',
            type: 'bytes32',
          },
        ],
        internalType: 'struct ResolvedOrder[]',
        name: 'resolvedOrders',
        type: 'tuple[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'reactorCallback',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
