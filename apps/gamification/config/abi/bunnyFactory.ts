export const bunnyFactoryABI = [
  {
    inputs: [
      {
        internalType: 'contract BunnyFactoryV2',
        name: '_bunnyFactoryV2',
        type: 'address',
      },
      {
        internalType: 'contract BunnyMintingStation',
        name: '_bunnyMintingStation',
        type: 'address',
      },
      {
        internalType: 'contract IBEP20',
        name: '_cakeToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenPrice',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_ipfsHash',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_startBlockNumber',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint8',
        name: 'bunnyId',
        type: 'uint8',
      },
    ],
    name: 'BunnyMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
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
    inputs: [],
    name: 'bunnyFactoryV2',
    outputs: [
      {
        internalType: 'contract BunnyFactoryV2',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bunnyMintingStation',
    outputs: [
      {
        internalType: 'contract BunnyMintingStation',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cakeToken',
    outputs: [
      {
        internalType: 'contract IBEP20',
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
        name: 'userAddress',
        type: 'address',
      },
    ],
    name: 'canMint',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'claimFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'hasClaimed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '_bunnyId',
        type: 'uint8',
      },
    ],
    name: 'mintNFT',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_bunnyId5Json',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_bunnyId6Json',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_bunnyId7Json',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_bunnyId8Json',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_bunnyId9Json',
        type: 'string',
      },
    ],
    name: 'setBunnyJson',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newStartBlockNumber',
        type: 'uint256',
      },
    ],
    name: 'setStartBlockNumber',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startBlockNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_newTokenPrice',
        type: 'uint256',
      },
    ],
    name: 'updateTokenPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
